import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPassengerPage } from './inicio-passenger.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPassengerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPassengerPageRoutingModule {}
