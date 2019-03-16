import { Component, OnInit } from "@angular/core";
import { UsersService } from "../Services/users.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(private uService: UsersService) {}

  ngOnInit() {}
}
