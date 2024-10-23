import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SessionService} from '../services/session.service';
import {ApiService} from '../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  public allBookings: any = [];
  progress: any = false;
  constructor(private api: ApiService) {}

  ngOnInit(): void {

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.getPreviousBookings();
    }, 300);
  }

  getPreviousBookings() {
    this.progress = true;
    this.api.getPreviousBookings().subscribe(data => {
      this.allBookings = data;
      this.progress = false;
      console.log('these are all bookings', this.allBookings);
    }, error => {
      this.progress = false;
      console.log('An error occurred while getting booking', error);
    });
  }

  getTime(date){
    return moment(date).format('DD-MM-YYYY  HH:mm');
  }

}
