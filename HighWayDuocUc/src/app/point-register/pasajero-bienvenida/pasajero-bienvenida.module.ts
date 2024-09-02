import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasajeroBienvenidaPageRoutingModule } from './pasajero-bienvenida-routing.module';

import { PasajeroBienvenidaPage } from './pasajero-bienvenida.page';
import { RegisterPageModule } from 'src/app/register/register.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasajeroBienvenidaPageRoutingModule,
    RegisterPageModule
  ],
  declarations: [PasajeroBienvenidaPage]
})
export class PasajeroBienvenidaPageModule {}
