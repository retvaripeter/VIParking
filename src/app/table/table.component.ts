import { Component, OnInit, ViewChild, ElementRef, OnChanges } from "@angular/core";
import { TableData } from "../Models/tableData.model";
import { TimeService } from "../Services/time.service";
import { DataService } from "../Services/data.service";
import { CalculatedTable } from "../Models/calculatedtable.model";
import { ChartModel } from "../Models/chart.model";
import { GridOptions } from "ag-grid-community";
import {
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit, OnChanges {
  private gridOptions: GridOptions;

  // use it to inform the template file that the parking places are full or not to disable the new parking button
  max10Car = false;
  // this is the variable for tableselection on Dashboard
  selectedData: any;
  // inform the template regarding that the parking place is totally empty. Goal is to disable the new parking button if all palces are empty.
  noParkBef = false;

 // ---------------------------------- VALIDATION PART ---------------------------------
//  basically creates a schema for every form element we would like to control and define the controlling flow inside the new FormControl() second argument. It's inside the array. E.g.: the first element in name field represents the error when a user touched but didn't fill out the inputfield.
  form = new FormGroup({
    rendszam: new FormControl("", [
      Validators.required,
      Validators.maxLength(6),
      Validators.pattern("[A-Z]{3}[0-9]{3}|[A-Z]{4}[0-9]{2}|[A-Z]{5}[0-9]{1}")
    ]),
    name: new FormControl("", [Validators.required, Validators.maxLength(100)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    autobrand: new FormControl("", [
      Validators.required,
      Validators.maxLength(100)
    ])
  });
  // QRCODE for parking

  qrCodeFizetve = "https://index.hu/sport/";

  // these variables will holds the user inputs below when a car comes in => method: onUjParkolas()

  autorendszam: string;
  behajtasido: string;
  nev: string;
  emailcim: string;

  // input data from the user

  @ViewChild("rendszam") rendszamRef: ElementRef;
  @ViewChild("name") nameRef: ElementRef;
  @ViewChild("email") emailRef: ElementRef;
  @ViewChild("autobrand") autobrandRef: ElementRef;

  // ------------------------------------  TABLE properties  ------------------------------------ 

  private gridApi;
  private gridColumnApi;
  // private gridOptions: GridOptions;
  private columnDefs;
  // this array holds the parking car data by implementing the tablaData model
  rowData: TableData[];
  private rowSelection;

  constructor(private tService: TimeService, private dService: DataService) {
    // Define the columns and setting up the headername and the reference field as well. We can easily set the sort and filter as well
    this.columnDefs = [
      {
        headerName: "Rendszám",
        field: "rendszam",
        sortable: true,
        filter: true
      },
      {
        headerName: "Érkezés ideje",
        field: "erkezes",
        sortable: true
      },
      {
        headerName: "Ügyfél neve",
        field: "name",
        filter: true,
        sortable: true
      },
      {
        headerName: "Ügyfél emailcíme",
        field: "email",
        filter: true,
        sortable: true
      },
      {
        headerName: "Autó márkája",
        field: "autobrand",
        sortable: true
      }
    ];
    // define the row data 

    this.rowData = [];
    this.rowSelection = "multiple";
  }
  // ------------------------------------------ TABLE ACTIONS/METHODS ------------------------------------------

  // method when a car left
  onRemoveSelected() {
    // get the leavetime
    const leaveTime = this.tService.getCurrentDate(new Date());
    // receive the selected row data and delte it from the table
    this.selectedData = this.gridApi.getSelectedRows();
    this.gridApi.updateRowData({ remove: this.selectedData });

    // using the selected data and get all the important info from the action
    let rendszam = this.selectedData[0].rendszam;
    let arriveTime = this.selectedData[0].erkezes;
    let name = this.selectedData[0].name;
    let email = this.selectedData[0].email;

    // we are creating a calculatedTable and put it in the carLeft variable (when a car left - check in the models folder how it will looks)
    const carLeft = new CalculatedTable(
      rendszam,
      arriveTime,
      leaveTime,
      name,
      email
    );
    // sending the car IDplate(rendszam) and the whole document as well to delete it from the database in the Dataservice Component
    this.dService.removeCar(rendszam, carLeft);

    // erkezes tavozas kuldese a megkezdett orakhoz
    this.tService.getMegKezdettOrak(arriveTime, leaveTime);
    // erkezes tavozas kuldese az osszes eltott orakhoz
    let osszesParkoltOra = this.tService.getOsszesEltoltottOra(
      arriveTime,
      leaveTime
      
    );
  // Creating the Chart x and y axis values. We need the frequencies. How can we know that how many x values we need? It's the length of the frequencyX or Y. We will iterate trough the values and creating this form/structue (you can find it in the CharModel):
    // {y: something, x: seomthing}

    // put the osszesParkoltOra to get the frequency
    let frequencyX = this.tService.getFrequencyX(osszesParkoltOra);
    let frequencyY = this.tService.getFrequencyY(osszesParkoltOra);   
    let max = frequencyX.length
    

  //  we iterate through the frequencies arrays and push it to the chartModelArray which will holds all the x and y values.

    let i = 0;
    let chartModelArray = [];
    do{
      chartModelArray.push(
        {y: frequencyY[i],x: frequencyX[i]}
        );
      i++;
    }
    while(i<max); 
    // we are emmitting the Chartvalue to use it in the Diagramm component.
    this.tService.ChartEmit.emit(
      chartModelArray 
    );

  }
  // get the apidata for the table on Dashboard
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  // WHen the user record a parking => RECORD PARKING
  onUjParkolas() {
    // 1) get the arriveTime in string from TimeService with sending the time of the click

    const arriveTime = this.tService.getCurrentDate(new Date());

    const rendszam = this.rendszamRef.nativeElement.value;
    const name = this.nameRef.nativeElement.value;
    const email = this.emailRef.nativeElement.value;
    const autobrand = this.autobrandRef.nativeElement.value;

    this.autorendszam = rendszam;
    this.behajtasido = arriveTime;
    this.nev = name;
    this.emailcim = email;

    // 2) create a new dataTable model with the getCurrentDate and the remaining user data and send it to the dataSerivce
    const newParkedCar = new TableData(
      rendszam,
      arriveTime,
      name,
      email,
      autobrand
    );
    this.dService.tableToDataService(newParkedCar);
   
  }

  ngOnInit() {
    // here we are just controlling the ujparkolas rogzitese and parkolas befejezes buttons to disable and enable it depending the cars in the house

    if (this.rowData.length === 0){
      this.noParkBef = true;
    }
    this.rowData = this.dService.getParkingCars();
    this.dService.aCarJustParked.subscribe((parkingCars: TableData[]) => {
    
      this.rowData = parkingCars;
      if (this.rowData.length === 10) {
        this.max10Car = true;
      } 
      if (this.rowData.length !== 0){
        this.noParkBef = false;
        } 

    });
    this.dService.aCarJustLeft.subscribe((carleft: CalculatedTable) => {
      this.max10Car = false;
    
    });
    this.dService.parkingTableEmit.subscribe(
      (parkleft: TableData[])=>{
        if(parkleft.length === 0){
          this.noParkBef = true;
        }
      }
    );
  }
  ngOnChanges(){
  
   
  }
}
