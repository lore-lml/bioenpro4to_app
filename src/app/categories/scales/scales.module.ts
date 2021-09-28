import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScalesPageRoutingModule } from './scales-routing.module';

import { ScalesPage } from './scales.page';
import {DailyChannelsPageModule} from '../../daily-channels/daily-channels.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ScalesPageRoutingModule,
        DailyChannelsPageModule
    ],
  declarations: [ScalesPage]
})
export class ScalesPageModule {}
