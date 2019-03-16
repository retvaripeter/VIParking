import { Component, OnInit } from "@angular/core";

import * as CanvasJS from "../canvasjs.min";
import { TimeService } from "../Services/time.service";
import { ChartModel } from "../Models/chart.model";

@Component({
  selector: "app-diagramm",
  templateUrl: "./diagramm.component.html",
  styleUrls: ["./diagramm.component.scss"]
})
export class DiagrammComponent implements OnInit {
  constructor(private tService: TimeService) {}

  // it will hold the parking cars with the CharModel schema to easily implement it when Angular is setting up the chart

  parkedCarsInHours: ChartModel[];

  // to get the current day
  currentDay = new Date().toDateString();

  ngOnInit() {
    // build up the structure for the chart (WITHOUT ANY INPUT DATA!!!)
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      axisY: {
        interval: 1,
        title: "Parkolt autók száma - (db)"
      },
      axisX: {
        interval: 1,
        title: "A parkolás(ok) időpontjai - (óra)"
      },
      title: {
        text: this.currentDay
      },
      data: [
        {
          type: "column",
          dataPoints: []
        }
      ]
    });

    chart.render();

    // fill up the structure with 'life' with the help of an observable: we are subscribing to the changes of chartEmit (basically when a car left it will emit in TimeService)

    this.tService.ChartEmit.subscribe((chartmodel: ChartModel[]) => {

// we need to check is the parkedCarsInHours is defined (is there any cars yet?) or not. if not, we can put the chartmodel inside, else we just push a another new chartmodel to the array.
      if(!this.parkedCarsInHours){
        
        this.parkedCarsInHours = chartmodel;
        
      }else {
        // we are using spread operator to push array into array instead of loop it
        this.parkedCarsInHours.push(...chartmodel);
      }
      // here we are creating the chart with the data we got above!
      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        axisY: {
          interval: 1,
          title: "Parkolt autók száma - (db)"
        },
        axisX: {
          interval: 1,
          title: "A parkolás(ok) időpontjai - (óra)"
        },
        title: {
          text: this.currentDay
        },
        data: [
          {
            type: "column",
            dataPoints: this.parkedCarsInHours
          }
        ]
      });

      chart.render();
    });
  }
  
}

