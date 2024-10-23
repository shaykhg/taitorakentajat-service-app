import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditServicePageRoutingModule } from './edit-service-routing.module';

import { EditServicePage } from './edit-service.page';
import {AddServicePageRoutingModule} from '../add-service/add-service-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {AddServicePageModule} from '../add-service/add-service.module';

@NgModule({
    imports: [
        CommonModule,
        EditServicePageRoutingModule,
        FormsModule,
        IonicModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatSliderModule,
        AddServicePageModule
    ],
  declarations: [EditServicePage]
})
export class EditServicePageModule {}
