import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingDetailsPageRoutingModule } from './booking-details-routing.module';

import { BookingDetailsPage } from './booking-details.page';
import {MatTabsModule} from '@angular/material/tabs';
import {ServicesViewComponent} from './services-view/services-view.component';
import {PackageViewComponent} from './package-view/package-view.component';
import {OrderViewComponent} from './order-view/order-view.component';
import {MatCardModule} from '@angular/material/card';
import {NgxIonicImageViewerModule} from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingDetailsPageRoutingModule,
    MatTabsModule,
    NgxIonicImageViewerModule,
    MatCardModule
  ],
  exports: [
    OrderViewComponent
  ],
  declarations: [BookingDetailsPage, ServicesViewComponent, PackageViewComponent, OrderViewComponent]
})
export class BookingDetailsPageModule {}
