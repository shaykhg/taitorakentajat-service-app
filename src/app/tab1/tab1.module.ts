import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {CustomerDetailsComponent} from './customer-details/customer-details.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRippleModule} from '@angular/material/core';
import {EditServiceComponent} from './edit-service/edit-service.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSelectModule} from '@angular/material/select';
import {AddServicesComponent} from './add-services/add-services.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {BookingDetailsPageModule} from '../booking-details/booking-details.module';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        Tab1PageRoutingModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatExpansionModule,
        MatRippleModule,
        ReactiveFormsModule,
        MatBottomSheetModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        BookingDetailsPageModule,
        MatDatepickerModule
    ],
  declarations: [Tab1Page, CustomerDetailsComponent, EditServiceComponent, AddServicesComponent]
})
export class Tab1PageModule {}
