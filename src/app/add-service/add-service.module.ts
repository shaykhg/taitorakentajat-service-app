import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServicePageRoutingModule } from './add-service-routing.module';

import { AddServicePage } from './add-service.page';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {PaintComponent} from './paint/paint.component';
import {FloorRepairComponent} from './floor-repair/floor-repair.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddServicePageRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatSlideToggleModule
    ],
  exports: [
    FloorRepairComponent,
    PaintComponent
  ],
    declarations: [AddServicePage, PaintComponent, FloorRepairComponent]
})
export class AddServicePageModule {}
