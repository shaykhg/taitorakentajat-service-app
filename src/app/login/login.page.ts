import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {SessionService} from '../services/session.service';
import {Router} from '@angular/router';
import {UtilService} from '../services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private util: UtilService, private router: Router, private session: SessionService,
              private fb: FormBuilder, private api: ApiService) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {
  }

  login(){
    const body = {
      identifier : this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };
    this.api.doLogin(body).subscribe(async data => {
      console.log('Login Data', data);
      try {
        if (data.user.role !== 'Service'){
          if (data.user.account){
            console.log('Saving token');
            await this.session.setToken(data.jwt);
            console.log('Saving account');
            await this.session.setUser(data.user.account);
            console.log('Adding token');
            await this.api.setToken();
            console.log('About to navigate');
            this.router.navigateByUrl('/');
          } else {
            await this.util.presentAlert('Account Configuration', 'Hi, looks like your account is not configured correctly. Please contact admin to resolve this issue!');
          }
        } else {
          await this.util.presentAlert('Login Failed', 'This app is only for service man, please use customer app to login.');
        }
      }catch (e) {
        this.util.presentToast('An unknown error occurred!');
        console.log(e);
        console.log('An error occurred in login!');
      }

    }, error => {
      this.util.presentToast('Unable to login, please check username and password!');
      console.log('An error occurred while logging in!');
    });
  }

}
