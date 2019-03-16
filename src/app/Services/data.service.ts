import { TableData } from "../Models/tableData.model";
import { CalculatedTable } from "../Models/calculatedtable.model";
import { EventEmitter } from "@angular/core";

export class DataService {
  aCarJustParked = new EventEmitter<TableData[]>();
  aCarJustLeft = new EventEmitter<CalculatedTable[]>();
  parkingTableEmit = new EventEmitter<TableData[]>();

  constructor() {}

  // DataBase for the actual parking cars. Maximum 10 cars
  private parkingCars: TableData[] = [

  ];
  // DataBase for the parked cars
  private parkedCars: CalculatedTable[] = [

  ];
  // receive parking cars data from TableComponent and updating the parkingCars array, and finally emit it as well
  tableToDataService(tableData: TableData) {
    this.parkingCars.push(tableData);
    this.aCarJustParked.emit(this.parkingCars.slice());
  }

  // returns the parkingCars array
  getParkingCars() {
    return this.parkingCars;
  }

  // removing a car from Parking cars when a car left (input data comes from TableComponent)
  removeCar(rendszam: string, carLeft: CalculatedTable) {
    // it will filter for the rendszam property only (because this is a unique key) and delete it from the array

    // 1) First we get the index of object with the 'incoming rendszam'
    let removeIndex = this.parkingCars
      .map(function(item) {
        return item.rendszam;
      })
      .indexOf(rendszam);

    // Use the index we got with the splice method to delete it from the parkingcars
    this.parkingCars.splice(removeIndex, 1);
    this.parkedCars.push(carLeft);
    this.aCarJustLeft.emit(this.parkedCars.slice());
    this.parkingTableEmit.emit(this.parkingCars.slice());
  }
}
