import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScalesPageRoutingModule } from './scales-routing.module';

import { ScalesPage } from './scales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScalesPageRoutingModule
  ],
  declarations: [ScalesPage]
})
export class ScalesPageModule {}
