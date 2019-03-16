import { Component, OnInit } from "@angular/core";
import { UsersService } from "../Services/users.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  users: {}[];

  constructor(private uService: UsersService) {}

  ngOnInit() {
    // using the userservice and updating the users above that we described it
    this.users = this.uService.getUsers();
  }
}
