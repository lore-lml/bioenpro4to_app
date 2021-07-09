import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScaleChannelsPageRoutingModule } from './scale-channels-routing.module';

import { ScaleChannelsPage } from './scale-channels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScaleChannelsPageRoutingModule
  ],
  declarations: [ScaleChannelsPage]
})
export class ScaleChannelsPageModule {}
