import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericMessagePageRoutingModule } from './generic-message-routing.module';

import { GenericMessagePage } from './generic-message.page';
import {DailyChannelsPageModule} from '../daily-channels.module';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenericMessagePageRoutingModule,
    DailyChannelsPageModule,
    MatExpansionModule
  ],
  declarations: [GenericMessagePage]
})
export class GenericMessagePageModule {}
