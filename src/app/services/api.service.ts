import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from './session.service';
import {Observable} from 'rxjs';
import {AppConstants} from '../AppConstants';
import * as moment from 'moment';
import {Service} from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers;

  constructor(private http: HttpClient, private session: SessionService) {
    // if user is logged in it will set headers automatically to headers variable
    // it also observe the changes so it will automatically handle everything
    this.session.auth.subscribe(data => {
      if (data){
        this.headers = { Authorization: `Bearer ${session.getToken()}`};
      } else {
        this.headers = {};
      }
    });
  }

  public setToken(): void {
    this.headers = { Authorization: `Bearer ${this.session.getToken()}`};
  }

  doLogin(body): Observable<any>{
    return this.http.post(AppConstants.API.LOGIN, body);
  }

  doSignUp(body): Observable<any>{
    return this.http.post(AppConstants.API.REGISTER, body);
  }

  // getServices(): any{
  //   return this.http.get(AppConstants.API.SERVICES + '?filter={"where": {"enable":true}}');
  // }

  getPackages(serviceId: string): any{
    return this.http.get(AppConstants.API.PACKAGES + '?enable=true&service=' + serviceId);
  }

  getSlots(city): any{
    const date = moment().startOf('day').toISOString();
    return this.http.get(AppConstants.API.SLOTS + `?filter={"where": {"available": true, "city": "${city.toLowerCase()}", "date": {"gt": "${date}"}}}`);
  }

  getUserSlots(): any{
    // return this.http.get(AppConstants.API.SLOTS + `?filter={"where": {"user": "${this.session.getUser().id}"}}`);
    return this.http.get(AppConstants.API.SLOTS + '?_sort=start:ASC&date_gte=' + new Date().toISOString() , {headers: this.headers});
  }

  placeBooking(body): any{
    return this.http.post(AppConstants.API.PLACE_BOOKING, body);
  }

  uploadImage(body: FormData): Observable<any>{
    return this.http.post(AppConstants.API.UPLOAD_IMAGES, body);
  }

  getPostCode(postCode): Observable<any>{
    return this.http.get(AppConstants.API.POSTCODE + `?filter={"where": {"postcode": "${postCode}"}}`);
  }

  getBookings(date: any): Observable<any>{
    const end = date.clone().endOf('day').toISOString();
    return this.http.get(AppConstants.API.BOOKINGS  + `?date_gte=${date.toISOString()}&date_lte=${end}&serviceMan=${this.session.getUser().id}`, {headers: this.headers});
  }

  getAllBookings(date: any): Observable<any>{
    return this.http.get(AppConstants.API.BOOKINGS  + `?date_gte=${date.toISOString()}&serviceMan=${this.session.getUser().id}`, {headers: this.headers});
  }

  getPreviousBookings(): Observable<any>{
   return this.http.get(AppConstants.API.BOOKINGS + `?serviceMan=${this.session.getUser().id}&date_lt=${new Date().toISOString()}`);
  }

  connectAccount(userId, role?): Observable<any>{
    return this.http.patch(AppConstants.API.PATCH_ACCOUNT + userId, role ? {role} :  {});
  }


  getBooking(id: string): Observable<any>{
   return this.http.get(AppConstants.API.BOOKINGS + '/' + id, {headers: this.headers});
  }

  addSlot(body): Observable<any>{
    return this.http.post(AppConstants.API.SLOTS, body, {headers: this.headers});
  }

  deleteSlot(id): Observable<any>{
    return this.http.delete(AppConstants.API.SLOTS + '/' + id,  {headers: this.headers});
  }

  searchCity(ciyName: string): Observable<any>{
    return this.http.get(AppConstants.API.CITIES + `?name_contains="${ciyName}`);
  }

  getAllCity(): Observable<any> {
    return this.http.get(AppConstants.API.CITIES + '?_limit=5000');
  }

  updateProfile(userId: any, body): Observable<any> {
    return this.http.patch(AppConstants.API.PROFILE + '/' + userId, body, {headers: this.headers});
  }

  updateBooking(id, body): Observable<any> {
    return this.http.put(AppConstants.API.BOOKINGS + '/' + id, body, {headers: this.headers});
  }

  updateUser(id, body): Observable<any> {
    return this.http.patch(AppConstants.API.PROFILE + '/' + id, body, {headers: this.headers});
  }

  getServices(): any {
    // return this.http.get(AppConstants.API.SERVICES + '?filter={"where": {"enable":true}}');
    return this.http.get(AppConstants.API.SERVICES + '?enable=true');
  }

  getService(id): Observable<Service> {
    return this.http.get<Service>(AppConstants.API.SERVICES + '/' + id);
  }
  // updateBooking(body, id): Observable<any> {
  //   return this.http.patch(AppConstants.API.BOOKINGS + '/' + id, body);
  // }
  getMe(): Observable<any>  {
    return this.http.get(AppConstants.API.ME, {headers: this.headers});
  }

  getProduct(product: string) {
    return this.http.get(AppConstants.API.PRODUCT + product);
  }
}
