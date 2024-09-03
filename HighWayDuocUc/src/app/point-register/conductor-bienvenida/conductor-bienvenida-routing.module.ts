import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConductorBienvenidaPage } from './conductor-bienvenida.page';

const routes: Routes = [
  {
    path: '',
    component: ConductorBienvenidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConductorBienvenidaPageRoutingModule {}
