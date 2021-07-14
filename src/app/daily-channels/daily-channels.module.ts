import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyChannelsPageRoutingModule } from './daily-channels-routing.module';

import { DailyChannelsPage } from './daily-channels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyChannelsPageRoutingModule
  ],
  declarations: [DailyChannelsPage]
})
export class DailyChannelsPageModule {}
