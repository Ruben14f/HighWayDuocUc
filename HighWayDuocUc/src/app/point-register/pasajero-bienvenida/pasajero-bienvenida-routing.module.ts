import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasajeroBienvenidaPage } from './pasajero-bienvenida.page';

const routes: Routes = [
  {
    path: '',
    component: PasajeroBienvenidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasajeroBienvenidaPageRoutingModule {}
