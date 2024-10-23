import {Component, Input, OnInit} from '@angular/core';
import {UtilService} from '../../services/util.service';
import {Booking} from '../../models/booking';
import {ModalController} from '@ionic/angular';
import {ViewerModalComponent} from 'ngx-ionic-image-viewer';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent implements OnInit {

  @Input() booking: Booking;

  constructor(public util: UtilService, public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.booking);
  }

  async openViewer(src) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {src},
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

}
