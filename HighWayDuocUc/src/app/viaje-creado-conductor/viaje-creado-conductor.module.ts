import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeCreadoConductorPageRoutingModule } from './viaje-creado-conductor-routing.module';

import { ViajeCreadoConductorPage } from './viaje-creado-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeCreadoConductorPageRoutingModule
  ],
  declarations: [ViajeCreadoConductorPage]
})
export class ViajeCreadoConductorPageModule {}
