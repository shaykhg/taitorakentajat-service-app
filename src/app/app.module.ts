import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, ReactiveFormsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    MatNativeDateModule,
    ClipboardModule,
    NgxIonicImageViewerModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }), BrowserAnimationsModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule {}
