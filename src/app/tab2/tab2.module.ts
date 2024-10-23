import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {HumanDatePipe} from '../human-date.pipe';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  declarations: [Tab2Page, HumanDatePipe],
  exports: [HumanDatePipe]
})
export class Tab2PageModule {}
