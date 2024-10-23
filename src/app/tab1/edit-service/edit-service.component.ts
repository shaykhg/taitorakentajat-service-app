import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {DataShareService} from '../../services/data-share.service';
import * as _ from 'lodash';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {MatSelectChange} from '@angular/material/select';
import {UtilService} from '../../services/util.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Service} from '../../models/service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss'],
})
export class EditServiceComponent implements OnInit {
  service: Service;
  totalPrice = 0;
  hideServiceBtn = false;
  packages = [];
  selectedPacks = [];

  constructor(private bottomSheetRef: MatBottomSheetRef<EditServiceComponent>, public data: DataShareService, public util: UtilService,
              @Inject(MAT_BOTTOM_SHEET_DATA) public serviceData: any, private fb: FormBuilder, private api: ApiService) {
  }

  ngOnInit() {
    console.log('service Data', this.serviceData);
    this.getService();
    this.getPackages();
  }

  setData() {
    console.log(this.data.serviceValue);
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getPackages(){
    this.api.getPackages(this.service.id).subscribe(data => {
      this.packages = data;
    }, err => {
      console.log(err);
      this.util.presentToast('An error occurred while getting packges');
    });
  }


  updateServices() {
    // if (this.serviceData.viewType === 1){
    //   const body = this.roofRenovationForm.value;
    //   const id = this.data.customerDetail.id;
    //
    //   this.api.updateBooking(body, id).subscribe(async data => {
    //     console.log(data);
    //   });
    // }
  }
  formatLabel(value: number): any {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'm2';
    }

    return value;
  }

  isInvalid(): boolean{
    for (const val of this.data.serviceValue.params){
      if (!val.value){
        return true;
      }
    }
    return false;
  }

  addService(): void {
    // dataShare.order.services.length
    const service: any = {};
    for (const param of this.data.serviceValue.params){
      service[param.key] = param.value;
      if (param.type === 'm2'){
        service.area = param.value;
      }
    }
    service.id = this.data.serviceValue.id;
    service.name = this.data.serviceValue.name;
    service.viewType = this.data.serviceValue.viewType;
    service.price = this.totalPrice;
    console.log(service);
    this.data.customerDetail.services.push(service);
    this.data.calculateTotal();
    this.data.addFormVisible = !this.data.addFormVisible;
    this.hideServiceBtn = !this.hideServiceBtn;
  }

  selection($event: MatSelectChange, param): void {
    console.log('Has price', param.options[0]);
    if (param.options[0].price){
      // has price need to add
      for (const val of  param.options){
        if (val.value === $event.value){
          param.price = val.price;
        }
      }
    }
    this.calculatePrice();
  }

  calculatePrice(): void {
    const area = _.find(this.data.serviceValue.params, {type: 'm2'});
    const price = _.sumBy(this.data.serviceValue.params, 'price');
    this.totalPrice = area.value * price;
    console.log(area, price);
  }

  updateService() {

  }

  addPackage($event: MatCheckboxChange, pack: any) {

  }

  private getService() {
    this.api.getService(this.serviceData.id).subscribe(data => {
      this.service = data;
    }, err => {
      console.log(err);
    });
  }
}
