import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPassengerPageRoutingModule } from './inicio-passenger-routing.module';

import { InicioPassengerPage } from './inicio-passenger.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPassengerPageRoutingModule,
  ],
  declarations: [InicioPassengerPage]
})
export class InicioPassengerPageModule {}
