import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiocellChannelsPageRoutingModule } from './biocell-channels-routing.module';

import { BiocellChannelsPage } from './biocell-channels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiocellChannelsPageRoutingModule
  ],
  declarations: [BiocellChannelsPage]
})
export class BiocellChannelsPageModule {}
