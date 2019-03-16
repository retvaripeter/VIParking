import { EventEmitter } from "@angular/core";
import { ChartModel } from "../Models/chart.model";

export class TimeService {
  // emitting the all data regarding time
  ChartEmit = new EventEmitter<ChartModel[]>();
  KasszaEmit = new EventEmitter<number>();
  JutalekEmit = new EventEmitter<number>();

  // when a car left these variables helps to calculate the final price and the commission
  oraDij = 500;
  kassza = 0;
  jutalekSzazalek = 0.1;
  jutalek = 0;
  arriveTime: any;

  // array which holds the number of hours of all the parked cars

  private kocsikParkoltOraja = [];

  // creates a copy of the private array above
  getKocsikParkoltOraja() {
    return this.kocsikParkoltOraja.slice();
  }

  // this method will return the X axis for the Chart in Diagram component. The input data coming from the frequency method (called in table component). The output data calculation is simple: creates 1 array for the values (without duplicated items) and makes another array (b) for the occurrencies/frequencies.

  getFrequencyX(array: number[]) {
    let a = [],
      b = [],
      prev;     

      array.sort();
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== prev) {
        a.push(array[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = array[i];
    }
    return a;
  }

  // it's the same like the previous one, except that this return the b array: y axis
  getFrequencyY(array: number[]) {
    let a = [],
      b = [],
      prev;

      array.sort();
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== prev) {
        a.push(array[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = array[i];
    }
  

    return b;
  }
  // calculate the difference between arrive and leave and get the MEGKEZDETT ORAK
  // INPUT data is coming from the TableComponent, when a car left (arrivetime, leavingTime)
  getMegKezdettOrak(dt1: string, dt2: string) {
    let diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
    diff /= 60 * 60;
    // to get the bigger integer number we use 'ceil'
    let megkezdettOra = Math.ceil(Math.abs(diff));
    // 95% goes to the cassa, because the commissin is 5%
    this.kassza =
      this.kassza + megkezdettOra * this.oraDij * (1 - this.jutalekSzazalek);
    this.jutalek =
      this.jutalek + megkezdettOra * this.oraDij * this.jutalekSzazalek;
    // here we are emitting the value of kassza and jutalek (jutalek and kassza components will subscribe to this)
    this.KasszaEmit.emit(this.kassza);
    this.JutalekEmit.emit(this.jutalek);
  }
  // calculating the range of the parked hours
  // INPUT data is coming from the TableComponent, when a car left (arrivetime, leavingTime)
  getOsszesEltoltottOra(dt1: string, dt2: string) {
    let erkezesOraja = new Date(dt1).getHours();
    let tavozasOraja = new Date(dt2).getHours();
  // this Do While Loop push the erkezesOraja first into the array which will hold all the parking house (kocsikParkoltoraja) and if there's more hour it will continue iterating till the tavozasOraja
    let i = erkezesOraja;

    do {
      this.kocsikParkoltOraja.push(i);
      i++;
    }
    while(i<=tavozasOraja);
    return this.kocsikParkoltOraja;
    
  }
  // calculate the current date - TableComponent will use it to get the arrive and leave time when a car arrives and leaves
  getCurrentDate(currentTime: any) {
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let date = currentTime.getDate();
    let month = currentTime.getMonth();
    let year = currentTime.getFullYear();

    this.arriveTime = `${year}-${month +
      1}-${date} ${hours}:${minutes}:${seconds}`;
    return this.arriveTime;
  }
}
