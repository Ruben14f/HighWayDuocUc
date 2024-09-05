import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTravelPageRoutingModule } from './create-travel-routing.module';

import { CreateTravelPage } from './create-travel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTravelPageRoutingModule
  ],
  declarations: [CreateTravelPage]
})
export class CreateTravelPageModule {}
