import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelHistoryPage } from './travel-history.page';

const routes: Routes = [
  {
    path: '',
    component: TravelHistoryPage
  },  {
    path: 'travel-history-conductor',
    loadChildren: () => import('./travel-history-conductor/travel-history-conductor.module').then( m => m.TravelHistoryConductorPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelHistoryPageRoutingModule {}
