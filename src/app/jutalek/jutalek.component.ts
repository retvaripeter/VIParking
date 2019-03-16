import { Component, OnInit } from "@angular/core";
import { TimeService } from "../Services/time.service";

@Component({
  selector: "app-jutalek",
  templateUrl: "./jutalek.component.html",
  styleUrls: ["./jutalek.component.scss"]
})
export class JutalekComponent implements OnInit {
  Jutalek: number;

  constructor(private tService: TimeService) {}

  ngOnInit() {
    this.Jutalek = this.tService.jutalek;
     // we are subscribing to the commisson kassza changes
    this.tService.JutalekEmit.subscribe((jutalek: number) => {
      this.Jutalek = jutalek;
    });
  }
}
