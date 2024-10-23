import {Component, OnInit} from '@angular/core';
import {DataShareService} from '../../services/data-share.service';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import * as _ from 'lodash';
import {FormBuilder, Validators} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {EditServiceComponent} from '../edit-service/edit-service.component';
import {ApiService} from '../../services/api.service';
import {ActivatedRoute} from '@angular/router';
import {AddServicePage} from '../../add-service/add-service.page';
import {UtilService} from '../../services/util.service';
import {EditServicePage} from '../../edit-service/edit-service.page';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  panelOpenState = false;
  showForm = false;
  interiorForm = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    squareMeter: ['', [Validators.required]],
    baseJob: ['', [Validators.required]],
    paint: ['', [Validators.required]],
  });
  roofRenovationForm = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    squareMeter: ['', [Validators.required]],
    roofIncension: ['', [Validators.required]],
    roofMaterial: ['', [Validators.required]],
  });

  constructor(private route: ActivatedRoute, public modalController: ModalController, private util: UtilService,
              public data: DataShareService, public alertController: AlertController, private fb: FormBuilder,
              private actionSheetController: ActionSheetController, private bottomSheet: MatBottomSheet, private api: ApiService) {
  }

  ngOnInit() {
    this.getService();
    console.log('this is customer detail', this.data.customerDetail);
    this.route.params.subscribe(params => {
      const id = params.id;
      if (!this.data.customerDetail){
        this.getOrderDetails(id);
      } else {
        this.data.customerDetail.services.map(item => {
          item.expand = 3;
        });
      }
      // In a real app: dispatch action to load the details here.
    });

  }

  async deleteAlert(detail) {
    if (this.data.customerDetail.services.length > 1){
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure you want to remove this service from order?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: Cancel');
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
              this.removeDetail(detail);
            }
          }
        ]
      });
      await alert.present();
    } else {
     await this.util.presentAlert('Not Allowed', 'Please add at least one more service in order to remove this service.');
    }

  }

  getServiceProps(service): any[]{
    let arr = Object.keys(service).map(key => ({ key, value: service[key] }));
    arr = _.filter(arr, (obj) => (obj.key !== 'id' && obj.key !== 'viewType' && obj.key !== 'area'));
    service.arr = arr;
    return arr;
  }

  removeDetail(service) {
    _.remove(this.data.customerDetail.services, {id: service.id});
    const serviceTotal = _.sumBy(this.data.customerDetail.services, 'price');

    _.remove( this.data.customerDetail.packages , {service: service.id});
    const packageTotal = _.sumBy(this.data.customerDetail.packages, 'price');

    const grandTotal = serviceTotal + packageTotal;

    const body = {
      services : this.data.customerDetail.services,
      packages : this.data.customerDetail.packages,
      total: grandTotal
    };
    this.api.updateBooking(this.data.customerDetail.id, body)
      .subscribe(result => {
      this.data.customerDetail = result;
      this.util.presentToast('Service removed successfully!');
    }, error => {
      console.log(error);
      this.util.presentToast('Unable to remove service correctly at the moment!');
    });
    console.log('Service Removed?', this.data.customerDetail.services);
  }


  async openBottomSheet(service) {
    // this.bottomSheet.open(EditServiceComponent, {
    //   data: service
    // });
    const modal = await this.modalController.create({
      component: EditServicePage,
      cssClass: 'my-custom-class',
      componentProps: { service }
    });
    return await modal.present();
  }

  changeValue($event): void {
    console.log($event.value);
    this.data.serviceValue = $event.value;
    this.data.addFormVisible = true;
  }

  getService(): any {
    this.api.getServices().subscribe(data => {
        // console.log(data);
        this.data.services = data;
        console.log('This is service data::', this.data.services);
      },
      error => {
        console.log(error.message);
      }
    );
  }

  private getOrderDetails(id) {
    this.api.getBooking(id).subscribe(data => {
      this.data.customerDetail = data;
      this.data.customerDetail.services.map(item => {
        item.expand = 3;
      });
    });
  }

  async addMoreService() {
    const modal = await this.modalController.create({
      component: AddServicePage,
      cssClass: 'my-custom-class',
      componentProps: { services: this.data.services }
    });
    return await modal.present();
  }

  async cancelOrder() {
    const cancel = await this.util.presentAlertConfirm('Yes', 'No', 'Are you sure, you want to cancel this order?', 'Cancel Order');
    if (cancel){
      const booking = await this.api.updateBooking(this.data.customerDetail.id, {status: 'CANCELLED'}).toPromise();
      this.data.customerDetail.status = booking.status;
    }
  }

}

