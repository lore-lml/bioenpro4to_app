import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruckChannelsPageRoutingModule } from './truck-channels-routing.module';

import { TruckChannelsPage } from './truck-channels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckChannelsPageRoutingModule
  ],
  declarations: [TruckChannelsPage]
})
export class TruckChannelsPageModule {}
