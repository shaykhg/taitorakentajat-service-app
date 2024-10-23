import {Component, OnInit} from '@angular/core';
import {DataShareService} from '../services/data-share.service';
import {ApiService} from '../services/api.service';
import * as _ from 'lodash';
import {UtilService} from '../services/util.service';
import {ModalController} from '@ionic/angular';
import {Service} from '../models/service';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
  styleUrls: ['./add-service.page.scss'],
})
export class AddServicePage implements OnInit {

  services = [];
  selectedPacks = [];
  service: Service;
  packages = [];
  serviceTotal = 0;
  serviceExists = false;
  protected area = 0;
  private addedPackages = [];

  getTotal: number;
  private total = 0;
  totalPrice = 0;

  constructor(private modalController: ModalController, public util: UtilService,
              private api: ApiService, public data: DataShareService) {}

  ngOnInit() {
    console.log(this.service);
    this.getServices();
  }

  close() {
    console.log('Close called@');
    this.modalController.dismiss().then(r => console.log(r)).catch(e => console.log(e));
  }

   async updateService($event) {
    const body = {
      services : $event.services,
      packages : $event.packages,
      total: $event.total
    };
    console.log('Going to post this', body);
    await this.util.presentLoading();
    this.api.updateBooking(this.data.customerDetail.id, body).subscribe(async data => {
      this.data.customerDetail = data;
      console.log('Order updated', data);
      await this.util.dismissLoading();
      const confirm = await this.util.presentAlertConfirm('OK', '', 'Hi service/packages are added to this order successfully!', 'Order Updated');
      this.modalController.dismiss();
    }, async error => {
      await this.util.dismissLoading();
      await this.util.presentAlert('Update Error', 'Hi, an error occurred while updating the order information!');
      console.log(error);
    });
  }

  private getServices() {
    this.api.getServices().subscribe(data => {
      console.log(data);
      this.services = data;
    }, err => {
      console.log(err);
    });
  }

  changedService($event: MatSelectChange) {
    this.serviceExists = _.find(this.data.customerDetail.services, {id: $event.value.id});
  }
}
