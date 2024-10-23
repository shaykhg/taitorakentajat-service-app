import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import {CustomerDetailsComponent} from './customer-details/customer-details.component';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: 'edit-order/:id',
    component: CustomerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
