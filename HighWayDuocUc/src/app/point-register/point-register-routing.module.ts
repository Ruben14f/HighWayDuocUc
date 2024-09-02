import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PointRegisterPage } from './point-register.page';

const routes: Routes = [
  {
    path: '',
    component: PointRegisterPage
  },  {
    path: 'pasajero-bienvenida',
    loadChildren: () => import('./pasajero-bienvenida/pasajero-bienvenida.module').then( m => m.PasajeroBienvenidaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointRegisterPageRoutingModule {}
