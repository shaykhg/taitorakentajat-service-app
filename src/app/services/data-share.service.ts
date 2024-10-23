import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  public customerDetail;
  public tempService;
  public addFormVisible = true;
  public serviceValue;
  public services;

  public addService = [];
  public packages = [];
  public totalPrice;
  loading = false;

  constructor() { }



  /**
   * This function can be used to make the total the order at any point of time
   */
  calculateTotal(): void {
    console.log(this.addService, 'Prices');
    const servicePrice = _.sumBy(this.addService, (o) => o.price);
    const packagePrice = _.sumBy(this.packages, (o) => o.price);
    this.totalPrice = servicePrice + packagePrice;
  }
}
