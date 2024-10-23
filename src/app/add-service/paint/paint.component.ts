import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Service} from '../../models/service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import * as _ from 'lodash';
import {DataShareService} from '../../services/data-share.service';
import {MatSelectChange} from '@angular/material/select';
import {ApiService} from '../../services/api.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss'],
})
export class PaintComponent implements OnInit {

  @Input() service: Service;
  // tslint:disable-next-line:align
  @Input() editMode = false;
  @Output() serviceComplete = new EventEmitter<any>();

  ready = false;
  totalPrice = 0;
  hideServiceBtn = false;
  changeColor = false;
  packages = [];
  area;
  private addedPackages: any[];
  public selectedPacks: any[];

  constructor(public data: DataShareService, private api: ApiService, public util: UtilService) { }

  ngOnInit(): void {
    console.log(this.service);
    for (const param of this.service.params){
      if (!param.value && param.value !== false) {
        param.value = '';
      }
    }
    this.getPackages();
  }

  formatLabel(value: number): any {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'm2';
    }

    return value;
  }

  isInvalid(): boolean{
    for (const val of this.service.params){
      if (!val.value && val.value !== false){
        return true;
      }
    }
    return false;
  }

  addPackage($event, pack) {
    if ($event.checked) {
      this.selectedPacks.push(pack.id);
      this.addedPackages.push(pack);
    } else {
      this.selectedPacks = this.selectedPacks.filter(e => e !== pack.id);
      this.addedPackages = this.addedPackages.filter(e => e.id !== pack.id);
      // _.remove(this.selectedPacks, pack._id);
    }
  }

  selection($event: MatSelectChange, param): void {
    // console.log('Has price', param.options[0]);
    if (param.options[0].price){
      // has price need to add
      for (const val of  param.options){
        if (val.value === $event.value){
          param.price = val.price;
        }
      }
    }
    console.log(param, $event);
    this.calculatePrice();
  }

  calculatePrice(): void {
    const area = _.find(this.service.params, {type: 'm2', key: 'Painting Area'});
    const groundwork = _.find(this.service.params, {key: 'Groundwork'});
    const ridge = _.find(this.service.params, {key: 'Ridge Height'});
    const downpipes = _.find(this.service.params, {key: 'Rainwater Downpipes'});
    const color = _.find(this.service.params, {key: 'Change Color'});
    this.service.area = area.value;
    const material = _.find(this.service.params, {key: 'Material'});
    if (material && material.value && material.value.length > 0){
      this.service.key = material.value;
      this.packages = _.filter(this.packages, item =>  item.key === this.service.key);
    }

    const rainwater = _.find(this.service.params, {key: 'Rainwater Renewal'});
    if (rainwater.value && !isNaN(rainwater.value)){
      if (rainwater.value > 150){
        // increase 10m2
        let diff = rainwater.value - 150;
        diff = (diff % 10) + diff;
        rainwater.total = 1104 + (diff / 10) * 10;
      } else {
        // decrease 6m2
        let diff = 150 - rainwater.value;
        diff = (diff % 10) + diff;
        rainwater.total = 1104 - (diff / 10) * 6;
      }
      console.log('Rainwater', rainwater);
    }
    if (ridge.value){
      ridge.total = ridge.value * ridge.price;
    }
    if (downpipes.value){
      downpipes.total = downpipes.value * downpipes.price;
    }
    groundwork.total = groundwork.price * area.value;
    area.total = area.price * area.value;
    const price = _.sumBy(this.service.params, 'total');
    this.totalPrice = price;
    if (color.value){
      this.totalPrice = this.totalPrice + (color.price / 100) * price;
    }
    this.calculatePackagePrice();
  }

  changedBoolean(param: any, $event: MatSlideToggleChange): void {
    const valid = param.key === 'Wooden Parts Change';
    if (param.value && valid){
      param.total = param.price;
    }
    this.calculatePrice();
  }

  getPackages() {
    this.api.getPackages(this.service.id).subscribe(data => {
      this.packages = data;
      this.calculatePrice();
    });
  }

  calculatePackagePrice() {
    this.addedPackages = [];
    this.selectedPacks = [];
    this.packages.forEach( item => {
      item.price = this.util.roundTo(_.sumBy(item.products, product => {
        if (product.fixed){
          return product.price;
        } else {
          if (product.metreSquare){
            // Need to calculate per given metres square instead of per meter2
            const total = Math.ceil(this.service.area / product.metres);
            // This works like this if a box is needed for 10m2 it will do 45m2/10 = 4.5 => 5 -> 5*price
            return product.price * total;
          } else {
            return product.price * this.service.area;
          }
        }
      }), 2);
      if (item.discount > 0){
        // calculate discount
        const discAmt = (item.discount / 100) * item.price;
        item.oldPrice = item.price;
        item.price = item.price - discAmt;
      }
      item.expanded = false;

      item.checked = !!_.find(this.data.customerDetail.packages, {id: item.id});
      if (item.checked) {
        this.addedPackages.push(item);
        this.selectedPacks.push(item.id);
      }
    });
    this.ready = true;
  }



  async addService() {
    const exists = !!_.find(this.data.customerDetail.services, {id: this.service.id}) && !this.editMode;
    const confirm = exists ? await this.util.presentAlertConfirm('Yes', 'No', 'This service already exists in order, this will overwrite existing service.', 'Are you sure?') : true;
    if (confirm){
      const service: any = {};
      for (const param of this.service.params){
        service[param.key] = param.value;
        if (param.key === 'Painting Area'){
          service.area = param.value;
        }
      }
      service.id = this.service.id;
      service.name = this.service.name;
      service.viewType = this.service.viewType;
      service.price = this.totalPrice;
      // const material = _.find(this.service.params, {key: 'Material'});
      // service.key = material.value;

      _.remove( this.data.customerDetail.services , {id: service.id});
      this.data.customerDetail.services.push(service);
      const serviceTotal = _.sumBy(this.data.customerDetail.services, 'price');

      _.remove( this.data.customerDetail.packages , {service: service.id});
      this.data.customerDetail.packages.push(...this.addedPackages);
      const packageTotal = _.sumBy(this.data.customerDetail.packages, 'price');

      const grandTotal = serviceTotal + packageTotal;

      const body = {
        services : this.data.customerDetail.services,
        packages : this.data.customerDetail.packages,
        total: grandTotal
      };
      this.serviceComplete.emit(body);
    }
  }
}
