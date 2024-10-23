import {Component, Input, OnInit} from '@angular/core';
import {Booking} from '../../models/booking';
import {UtilService} from '../../services/util.service';
import {ModalController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.scss'],
})
export class PackageViewComponent implements OnInit {


  @Input() booking: Booking;

  constructor(public util: UtilService) { }

  ngOnInit() {
    console.log('Bookking Details', this.booking);
  }



}
