import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelHistoryConductorPage } from './travel-history-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: TravelHistoryConductorPage
  },
  {
    path: 'travel-history-conductor',
    loadChildren: () => import('./travel-history-conductor.page').then( m => m.TravelHistoryConductorPage)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelHistoryConductorPageRoutingModule {}
