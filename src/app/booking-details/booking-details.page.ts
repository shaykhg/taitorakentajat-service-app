import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../services/api.service';
import {UtilService} from '../services/util.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {

  constructor(private route: ActivatedRoute, private api: ApiService, public util: UtilService) { }

  booking;
  orderId = '';
  progress: any = false;
  isShown = false;

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.getOrderDetails(this.orderId);
  }

  getOrderDetails(id: string): void{
    this.progress = true;
    this.api.getBooking(this.orderId).subscribe(async data => {
      const packs = data.packages;
      let services = data.services;
      console.log('Packages', packs);
      if (packs){
        for (const p of packs){
          p.expand = false;
        }
        services = _.map(services, service => {
          console.log('Service inout', service);
          if (service.package){
            service.packages = this.findProducts(service.package, packs);
          } else {
            service.package = [];
          }
          return service;
        });
      }
      this.booking = data;
      this.booking.services = services;
      this.progress = false;
      console.log('myOrder', data);
    }, error => {
      this.progress = false;
      console.log(error.message);
      this.util.presentToast('Error while getting order');
    });
  }

  findProducts(input, packages): any[]{
    console.log('Input', input, packages);
    const products = [];
    for (const item of input){
      const packs = _.find(packages, {id: item});
      products.push(packs);
    }

    return products;
  }

  async cancelOrder() {
    const cancel = await this.util.presentAlertConfirm('Yes', 'No', 'Are you sure, you want to cancel this order?', 'Cancel Order');
    if (cancel){
      const booking = await this.api.updateBooking(this.orderId, {status: 'CANCELLED'}).toPromise();
      this.booking.status = booking.status;
    }
  }
}
