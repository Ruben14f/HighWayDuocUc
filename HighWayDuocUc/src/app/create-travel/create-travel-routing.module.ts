import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTravelPage } from './create-travel.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTravelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTravelPageRoutingModule {}
