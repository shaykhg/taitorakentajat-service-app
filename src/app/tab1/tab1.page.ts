import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {ApiService} from '../services/api.service';
import {UtilService} from '../services/util.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DataShareService} from '../services/data-share.service';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  username = '';
  dates = [];
  selectedDate;
  bookings = [];
  progress = false;
  public type = 2;
  allBookings = [];

  constructor(private session: SessionService, private api: ApiService, private util: UtilService, public alertController: AlertController,
              private route: Router, public data: DataShareService) {}

  ngOnInit(): void {
    this.initDays();
    if (this.session.getUser().name){
      this.username = this.session.getUser().name;
    }

  }

  initDays() {
    for (let i = 0; i < 30; i++) {
      const day = moment().clone().add(i, 'day');
      this.dates.push({
        name: day.format('ddd'),
        date: day.format('DD.MM'),
        value: day
      });
    }
    setTimeout(() => {
      this.getBookings(this.dates[0]);
    }, 300);
  }

  getTime(date) {
    return moment(date).format('DD-MM-YYYY  HH:mm');
  }

  getBookings(day) {
    this.progress = true;
    this.selectedDate = day;
    this.api.getBookings(day.value.startOf('day')).subscribe(data => {
      this.bookings = data;
      this.bookings.forEach(el => {
        el.expanded = false;
      });
      this.progress = false;
    }, error => {
      this.util.presentToast('Unable to get bookings!');
      console.log('An error occurred');
      this.progress = false;
    });

  }

  getAllBookings() {
    this.progress = true;
    this.api.getAllBookings(moment().startOf('day')).subscribe(data => {
      this.allBookings = data;
      this.allBookings.forEach(el => {
        el.expanded = false;
      });
      this.progress = false;
    }, error => {
      this.util.presentToast('Unable to fetch bookings!');
      console.log('An error occurred');
      this.progress = false;
    });

  }

  showbtns(booking) {
    booking.expanded = true;
  }

  async showApprovalAlert(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Approve!',
      message: 'Are sure you want to approve this booking based on details provided?',
      inputs: [
        {   name: 'notes',
            id: 'notes',
            type: 'textarea',
            placeholder: 'Enter Notes'
  },
      ],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: (data) => {
            console.log('Confirm Okay', data.notes);
            this.approve(id, data.notes);
          }
        }
      ]
    });

    await alert.present();
  }

  approve(id, notes) {
    const body = {
      approved: true,
      serviceNotes: notes
    };
    this.api.updateBooking(id, body).subscribe(data => {
      this.util.presentToast('Booking approved successfully');
      this.getAllBookings();
      this.getBookings(this.selectedDate);
    }, error => {
      console.log('An error occurred while updating Booking');
    });

  }

  customerDetail(booking: any) {
    this.data.customerDetail = booking;
    this.route.navigateByUrl('tabs/tab1/edit-order/' + booking.id);
  }
}
