import { HostListener, Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import {AppConstants} from '../AppConstants';
import {ClipboardService} from 'ngx-clipboard';
// import {ClipboardService} from 'ngx-clipboard';
// import {AppConstants} from '../AppConstants';

@Injectable({
  providedIn: 'root',
})

/**
 * This services contains variables and functions which
 * are required globally in multiple components
 */
export class UtilService {
  public isDesktop = false;
  public innerWidth = window.innerWidth;
  // public IMAGE_BASE_URL = AppConstants.BASE_URL;
  loading: HTMLIonLoadingElement;
  public IMAGE_BASE_URL = AppConstants.BASE_URL;
  BASE_URL = AppConstants.BASE_URL;
  constructor(
    private clipboardService: ClipboardService,
    private platform: Platform,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {
    this.isDesktop = this.platform.is('desktop');
    console.log('Desktop ? ', this.isDesktop);
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log('this is innerwidht', this.innerWidth);
  }

  /**
   * This function supply status colors based on status text for meetings page
   * @param status Status of the meeting
   */
  public getStatus(status: string) {
    status = status.toUpperCase();
    if (status === 'PENDING') {
      return '#ff5722';
    } else if (status === 'COMPLETED') {
      return '#00701a';
    } else if (status === 'SCHEDULED') {
      return '#006db3';
    } else if (status === 'APPROVED') {
      return '#4caf50';
    }  else if (status === 'CANCELLED') {
      return '#d60b0b';
    } else if (status === 'PAYMENT_FAILED') {
      return '#f44336';
    } else {
      return '#212121';
    }
  }

  /**
   * Round off a number to n decimal digits
   * @param num Number itself
   * @param places Places e.g; 2 for 11.24
   */
  public roundTo(num: number, places: number): number {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

  public groupBy(dataToGroupOn, fieldNameToGroupOn, fieldNameForGroupName, fieldNameForChildren): any {
    return _.chain(dataToGroupOn)
      .groupBy(fieldNameToGroupOn)
      .toPairs()
      .map((currentItem) => {
        return _.zipObject([fieldNameForGroupName, fieldNameForChildren], currentItem);
      }).value();
  }

  /**
   * This function supply status colors based on status for meetings product listing
   * @param status availability of the product
   */
  public getProductStatus(status: number) {
    if (status === 1) {
      return 'green';
    } else if (status === 2) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  /**
   * This function can be used to display alerts by passing
   * title and message.
   * @param title Title of your message
   * @param message Message which you want to display
   * @param subtitle Optional field, used to display subtitle of dialog
   */
  public async presentAlert(title: string, message: string, subtitle?: string) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle ? subtitle : null,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  /**
   * This function can be used to created alert with custom button
   * and actions
   * @param positive Name of the positive button
   * @param negative Name of the negative button
   * @param message Message content to be displayed on alert
   * @param title Title of the message
   * @param subtitle Subtitle of the alert
   */
  async presentAlertConfirm(
    positive,
    negative,
    message,
    title,
    subtitle?: string
  ) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: title,
        subHeader: subtitle ? subtitle : null,
        message,
        buttons: [
          {
            text: negative,
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          },
          {
            text: positive,
            handler: () => {
              resolve(true);
            },
          },
        ],
      });
      await alert.present();
    });
  }

  /**
   * This function is to be used to display ion toast or snackbar style
   * message using ToastController
   * @param message This is the text which will be displayed on snackbar
   * @param time This is the duration for how long message should be visible
   */
  async presentToast(message: string, time: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration: time,
    });
    await toast.present();
  }


  getDate(date){
    return moment(date).format('DD-MM-YYYY');
  }

  getTime(date){
    return moment(date).format('HH:mm');
  }

  /**
   * This is to be used to display an alert style progress
   * for an ongoing event or API calls, you should call dismissLoading
   * function to dismiss the dialogue
   * @param message Text of what message needs to displayed
   */
  async presentLoading(message: string = 'Please wait...') {
    this.loading = await this.loadingController.create({
      message,
    });
    await this.loading.present();
  }

  async copyToClipBoard(text: string, msg: string = 'Text copied to clipboard successfully!'){
    this.clipboardService.copy(text);
    await this.presentToast(msg);
  }

  /**
   * Dismiss the existing loading bar displaying currently
   */
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  public titleCase(text): string {
    return text.replace(/\w\S*/g,  (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }


  public getIndianDate(date): string {
    return moment(date).format('DD-MMM-YYYY');
  }

  /**
   * Get date in this format :: 24th May 2018, 02:54 PM
   * @param date Date with time
   */
  public getHumanDateTime(date): string {
    return moment(date).format('MMMM Do YYYY, HH:mm');
  }

  /**
   * This function can be used to restrict an input field of text type to accept only number
   * to be used like this onkeypress="return isNumberKey(event)"
   * @param evt Event of key press
   */
  public isNumberKey(evt): boolean {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    return !(charCode !== 46 && charCode > 31
      && (charCode < 48 || charCode > 57));
  }

  /**
   * This function should only be used if you don't want to effect time in a date
   * due to timezone - This will 2021-06-12T17:06:59.999Z be 2021-06-12T17:00:00.000Z
   */
  public noTimeISOString(date: string){
     const d = date.split('T')[0];
     return d + 'T00:00.000Z';
  }

}
