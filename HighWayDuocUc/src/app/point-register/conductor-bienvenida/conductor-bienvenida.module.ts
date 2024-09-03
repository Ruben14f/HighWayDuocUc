import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConductorBienvenidaPageRoutingModule } from './conductor-bienvenida-routing.module';

import { ConductorBienvenidaPage } from './conductor-bienvenida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConductorBienvenidaPageRoutingModule
  ],
  declarations: [ConductorBienvenidaPage]
})
export class ConductorBienvenidaPageModule {}
