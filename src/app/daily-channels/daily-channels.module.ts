import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DailyChannelsPageRoutingModule } from './daily-channels-routing.module';

import { DailyChannelsPage } from './daily-channels.page';
import {MatExpansionModule} from '@angular/material/expansion';
import {DailyChannelItemComponent} from './daily-channel-item/daily-channel-item.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DailyChannelsPageRoutingModule,
        MatExpansionModule
    ],
  declarations: [DailyChannelsPage, DailyChannelItemComponent]
})
export class DailyChannelsPageModule {}
