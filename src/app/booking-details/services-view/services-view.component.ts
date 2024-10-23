import {Component, Input, OnInit} from '@angular/core';
import {Booking} from '../../models/booking';
import {UtilService} from '../../services/util.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-services-view',
  templateUrl: './services-view.component.html',
  styleUrls: ['./services-view.component.scss'],
})
export class ServicesViewComponent implements OnInit {

  @Input() booking: Booking;

  constructor(public util: UtilService) { }

  ngOnInit() {
    this.booking.services.map(item => {
      item.expand = 3;
    });
  }

  getServiceProps(service): any[]{
    let arr = Object.keys(service).map(key => ({ key, value: service[key] }));
    arr = _.filter(arr, (obj) => (obj.key !== 'id' && obj.key !== 'viewType' && obj.key !== 'area'));
    service.arr = arr;
    return arr;
  }

}
