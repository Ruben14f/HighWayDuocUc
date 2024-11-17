import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreHomePageRoutingModule } from './pre-home-routing.module';

import { PreHomePage } from './pre-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreHomePageRoutingModule
  ],
  declarations: [PreHomePage]
})
export class PreHomePageModule {}
