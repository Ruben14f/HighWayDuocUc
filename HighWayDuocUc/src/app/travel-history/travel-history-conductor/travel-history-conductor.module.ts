import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelHistoryConductorPageRoutingModule } from './travel-history-conductor-routing.module';

import { TravelHistoryConductorPage } from './travel-history-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelHistoryConductorPageRoutingModule
  ],
  declarations: [TravelHistoryConductorPage]
})
export class TravelHistoryConductorPageModule {}
