import { Component, OnInit } from "@angular/core";
import { TimeService } from "../Services/time.service";

@Component({
  selector: "app-kassza",
  templateUrl: "./kassza.component.html",
  styleUrls: ["./kassza.component.scss"]
})
export class KasszaComponent implements OnInit {
  Kassza: number;

  constructor(private tService: TimeService) {}

  ngOnInit() {
    this.Kassza = this.tService.kassza;
    // we are subscribing to the actual kassza changes
    this.tService.KasszaEmit.subscribe((penz: number) => {
      this.Kassza = penz;
    });
  }
}
