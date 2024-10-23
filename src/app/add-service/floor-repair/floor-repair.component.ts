import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Service} from '../../models/service';
import {MatSelectChange} from '@angular/material/select';
import {UtilService} from '../../services/util.service';
import {ApiService} from '../../services/api.service';
import * as _ from 'lodash';
import {DataShareService} from '../../services/data-share.service';

@Component({
  selector: 'app-floor-repair',
  templateUrl: './floor-repair.component.html',
  styleUrls: ['./floor-repair.component.scss'],
})
export class FloorRepairComponent implements OnInit {

  // Service object from API passed to this component
  @Input() service: Service;
  // If in edit mode, this must be set to true
  @Input() editMode = false;
  // Upon adding or editing of service this will emit data of service and packages
  @Output() serviceComplete = new EventEmitter<any>();

  services = [];
  selectedPacks = [];
  packages = [];
  serviceTotal = 0;
  protected area = 0;
  private addedPackages = [];
  getTotal: number;
  totalPrice = 0;
  private allPacks = [];

  constructor(public util: UtilService, private api: ApiService, public data: DataShareService) { }

  ngOnInit() {
    console.log('Floor Repair', 'Edit Mode :: ' + this.editMode);
    this.getPackages();
  }

  getPackages() {
    this.api.getPackages(this.service.id).subscribe(data => {
      this.packages = data;
      if (this.editMode){
        this.packages.forEach(item => {
          item.checked = !!_.find(this.data.customerDetail.packages, {id: item.id});
          if (item.checked) {
            this.addedPackages.push(item);
            this.selectedPacks.push(item.id);
          }
        });

        /* This helps in getting package price as per already added service params
          Without this non related packages of the services will also appear */
        this.calculatePrice();
      }

      this.allPacks = [...this.packages];
    });
  }

  formatLabel(value: number): any {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'm2';
    }

    return value;
  }

  isInvalid(): boolean {
    if (!this.service){
      return false;
    }
    for (const val of this.service.params) {
      if (!val.value) {
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
    }
  }

  selection($event: MatSelectChange, param): void {
    if (param.options[0].price) {
      // has price need to add
      for (const val of param.options) {
        if (val.value === $event.value) {
          param.price = val.price;
        }
      }
    }
    this.calculatePrice();
  }

  async addService() {
    const exists = !!_.find(this.data.customerDetail.services, {id: this.service.id}) && !this.editMode;
    const confirm = exists ? await this.util.presentAlertConfirm('Yes', 'No', 'This service already exists in order, this will overwrite existing service.', 'Are you sure?') : true;
    if (confirm){
      const service: any = {};
      for (const param of this.service.params) {
        service[param.key] = param.value;
        if (param.type === 'm2') {
          service.area = param.value;
        }
      }
      service.id = this.service.id;
      service.name = this.service.name;
      service.package = this.selectedPacks;
      service.viewType = this.service.viewType;
      service.price = this.serviceTotal;
      // This line is added to remove the item if already added
      _.remove( this.data.customerDetail.services , {id: service.id});
      this.data.customerDetail.services.push(service);
      const serviceTotal = _.sumBy(this.data.customerDetail.services, 'price');

      // This line is added to remove the item if already added
      _.remove( this.data.customerDetail.packages , {service: service.id});
      if (this.data.customerDetail.packages){
        this.data.customerDetail.packages.push(...this.addedPackages);
      } else {
        this.data.customerDetail.packages = this.addedPackages;
      }
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


  calculatePrice(): void {
    console.log(this.service);
    const area = _.find(this.service.params, {type: 'm2'});
    this.area = area.value;
    let price = 0;
    for (const p of this.service.params){
      price = p.price + (price || 0.);
    }

    // To grab the material this could be something else but it is the key
    // based on which we can configure different packages for example if service using one material
    // it's key can be passed so only package related to it will be shown.
    const material = _.find(this.service.params, {key: 'New Material'});
    if (material && material.value && material.value.length > 0){
      this.service.key = material.value;
      console.log('key', this.service.key, this.packages);
      this.packages = _.filter(this.allPacks, item =>  item.key === this.service.key);
      console.log('key', this.service.key, this.packages);
    }

    this.serviceTotal = this.area * price;
    this.calculatePackagePrice();
  }

  calculatePackagePrice() {
    this.addedPackages = [];
    this.selectedPacks = [];
    for (const item of this.packages) {
      item.price = this.util.roundTo(_.sumBy(item.products, product => {
        return product.fixed ? product.price : product.price * this.area;
      }), 2);
      if (item.checked) {
        this.addedPackages.push(item);
        this.selectedPacks.push(item.id);
      }
    }
  }

}
