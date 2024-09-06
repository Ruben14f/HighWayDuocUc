import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Combina las importaciones de FormsModule y ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { CreateTravelPageRoutingModule } from './create-travel-routing.module';

import { CreateTravelPage } from './create-travel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateTravelPageRoutingModule
  ],
  declarations: [CreateTravelPage]
})
export class CreateTravelPageModule {}
