import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../Services/users.service";
import { ActivatedRoute, Params } from "@angular/router";
import { DataService } from "src/app/Services/data.service";
import { TableData } from "src/app/Models/tableData.model";
import { CalculatedTable } from "src/app/Models/calculatedtable.model";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  user: {}[];

  // we will display these variables on the user card
  id: number;
  szabadhelyek = 10;

  constructor(
    private uService: UsersService,
    private route: ActivatedRoute,
    private dService: DataService
  ) {}

  ngOnInit() {
    this.user = this.uService.getUsers();
    // get the userID from the url with params by subscribing to the route changes
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"] - 1;
    });
    // updating the szabadhelyek by subscribing to the dataService. Basically it reduce the szabadhelyek by one when a car left the 'house'
    this.dService.aCarJustParked.subscribe((auto: TableData) => {
      this.szabadhelyek = this.szabadhelyek - 1;
    });
     // it's the opposite of the previous one
    this.dService.aCarJustLeft.subscribe((auto: CalculatedTable) => {
      this.szabadhelyek = this.szabadhelyek + 1;
    });
  }
}
