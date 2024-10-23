import {Component, Input, OnInit} from '@angular/core';
import {DataShareService} from '../services/data-share.service';
import {ApiService} from '../services/api.service';
import * as _ from 'lodash';
import {UtilService} from '../services/util.service';
import {ModalController} from '@ionic/angular';
import {Service} from '../models/service';


@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.page.html',
  styleUrls: ['./edit-service.page.scss'],
})
export class EditServicePage implements OnInit {

  @Input() service: any;
  serviceMain: Service;
  selectedPacks = [];
  packages = [];
  serviceTotal = 0;
  getTotal: number;
  protected area = 0;

  constructor(private modalController: ModalController, public util: UtilService,
              private api: ApiService, public data: DataShareService) {
  }

  ngOnInit() {
    this.selectedPacks = this.service.package ? this.service.package : [];
    this.getService();
  }

  close() {
    console.log('Close called@');
    this.modalController.dismiss().then(r => console.log(r)).catch(e => console.log(e));
  }

  async updateService($event) {
    const body = {
      services: $event.services,
      packages: $event.packages,
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

  private getService() {
    this.api.getService(this.service.id).subscribe(data => {
      this.serviceMain = data;
      for (const param of this.serviceMain.params) {
        const found = _.find(this.service.arr, {key: param.key});
        param.value = found.value;
        if (param.type === 'option') {
          const option = _.find(param.options, {value: param.value});
          param.price = option.price || 0;
        } else {
          param.price = 0;
        }
      }
    }, err => {
      console.log(err);
    });
  }
}
