import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import {SessionService} from '../services/session.service';
import {AlertController} from '@ionic/angular';
import {UtilService} from '../services/util.service';
import {from, Observable} from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public type = 2;
  myControl: string;

  filteredOptions: Observable<any[]>;

  slots = [];
  filteredCities = [];

  slotForm = this.form.group({
    date: ['', [Validators.required]],
    from: ['', [Validators.required]],
    till: ['', [Validators.required]]
  });

  clockTheme = {
    container: {
      bodyBackgroundColor: '#fafafa',
      buttonColor: '#4caf50'
    },
    dial: {
      dialActiveColor: '#fff',
      dialBackgroundColor: '#4caf50'
    },
    clockFace: {
      clockFaceBackgroundColor: '#f0f0f0',
      clockHandColor: '#4caf50',
      clockFaceTimeInactiveColor: '#424242'
    }
  };
  currentDate = new Date();
  month: any = moment();
  days = [];
  date: any = moment().add(1, 'day').startOf('day').toISOString();
  currentTime = moment().toISOString();
  startTime: any;
  endTime: any;
  progress: any = false;
  selectDate: any;
  selectedCity: any;
  private allCities: any = [];
  mCity = '';

  constructor(public alertController: AlertController, private session: SessionService,
              private form: FormBuilder, private api: ApiService, private util: UtilService) {}

  ngOnInit(): void {
    this.getAllCity();
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.name),
    //     map(name => name ? this._filter(name) : this.allCities.slice())
    //   );

    setTimeout(() => {
      this.getSlots();
      }, 300);
    this.month = moment();
    this.days = this.getDaysArrayByMonth(this.month);
    }

    getAllCity() {
    this.api.getAllCity().subscribe(data => {
      this.allCities = _.uniqBy(_.map(data, (c) => {
        const city = c;
        city.name = this.util.titleCase(city.name);
        return city;
      }), 'name');

      console.log('these are all unique city', this.allCities);

    }, err => {
      console.log('An error occurred while getting city');
    });
    }


  getDate(date, isTime){
    if (isTime){
      return moment(date).format('HH:mm');
    } else {
      return moment(date).format('DD-MM-YYYY');
    }
  }

  getSlots(){
    this.progress = true;
    this.api.getUserSlots().subscribe(data => {
      this.slots = data;
      this.progress = false;
    }, err => {
      this.progress = false;
      console.log('An error occurred while getting slots', err);
    });
  }

  formatDate(month: any, format: string) {
    return month.format(format);
  }

  prevMonth(){
    this.month.subtract(1, 'month');
    this.days = this.getDaysArrayByMonth(this.month.clone());
  }

  nextMonth(){
    this.month.add(1, 'month');
    this.days = this.getDaysArrayByMonth(this.month.clone());
  }

   getDaysArrayByMonth(obj) {
    let daysInMonth = obj.daysInMonth();
    const arrDays = [];
    while (daysInMonth) {
      const current = moment().date(daysInMonth);
      arrDays.push(current);
      daysInMonth--;
    }
    return arrDays.reverse();
  }

  /**
   * Date set from calendar scroll bar
   * @param day Day in moment
   */
  setDate(day: any) {
    console.log('Clicked on the day!', day);
  }

  slotScreenUi(type: number) {
    if (type === 1) {
      this.type = 1;
      return 'tab-btn';
    } else {
      this.type = 2;
      return 'tab-btn-selected';
    }
  }

  async showAlert(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are sure you want to remove this slot?',
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
          handler: () => {
            this.removeSlot(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  removeSlot(id) {
  //  call remove slot api here and get slots again
    this.api.deleteSlot(id).subscribe(data => {
      console.log('This slot was deleted', data);
      this.util.presentToast('Slot removed successfully');
      this.getSlots();
    }, err => {
      console.log('An error occurred while deleting slot');
    });
  }

  saveSlot() {
    const validForm = !(this.selectDate === undefined || this.startTime === undefined || this.endTime === undefined) ;
    const day = moment(this.selectDate).endOf('day');
    const fromTime = moment(this.startTime);
    const tillTime = moment(this.endTime);

    console.log(this.selectDate, this.startTime, this.endTime,  day.toISOString(), fromTime.toISOString(), tillTime.toISOString());

    const start = day.clone().toDate();
    start.setHours(fromTime.hours());
    start.setMinutes(fromTime.minutes());

    const end = day.clone().toDate();
    end.setHours(tillTime.hours());
    end.setMinutes(tillTime.minutes());

    const validTime = !(moment(end).isSame(moment(start)) && moment(end).isBefore(moment(start)));


    const city = '';
    const body = {
      city: this.mCity.toLowerCase(),
      date: this.util.noTimeISOString(day.toISOString()),
      start: start.toISOString(),
      end: end.toISOString(),
      user: this.session.getUser().id,
      available: true
    };


    const validCity = this.checkCityValid();

    console.log('Slot body', body);

    if (validForm && validCity) {
      if (validTime) {
        this.api.addSlot(body).subscribe(result => {
          console.log(result);
          this.getSlots();
          this.util.presentToast('Slot added successfully');
        },  err  => {
          console.log(err);
          this.util.presentToast('An error occurred while adding slot');
        });
      } else {
        console.log('Please select valid time');
        this.util.presentToast('Please enter a valid Time');

      }
    } else {
      console.log('Please select Time');
      this.util.presentToast(!validForm ? 'Please Select Date and Time' : 'Please select valid city');
    }
    // console.log('this is validity log', start.isSame(end) , end.isBefore(start));
    console.log('this is date', this.date);
    console.log('this is start time', start.toISOString());
    console.log('this is end time', end.toISOString());
  }

  displayFn(user: any): string {
    console.log('User chaange', user);
    return user && user.name ? user.name : '';
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.allCities.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  changedCity(city: string): void {
    const filterValue = city.toLowerCase();
    console.log(city);
    this.filteredCities = this.allCities.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  checkCityValid(): boolean {
    const found = _.find(this.allCities, ['name', this.mCity]);
    console.log('Is Valid? ', found);
    return found || false;
  }
}
