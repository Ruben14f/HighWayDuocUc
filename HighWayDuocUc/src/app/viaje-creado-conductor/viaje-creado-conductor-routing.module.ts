import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeCreadoConductorPage } from './viaje-creado-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeCreadoConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeCreadoConductorPageRoutingModule {}
