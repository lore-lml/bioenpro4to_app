import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrucksPageRoutingModule } from './trucks-routing.module';

import { TrucksPage } from './trucks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrucksPageRoutingModule
  ],
  declarations: [TrucksPage]
})
export class TrucksPageModule {}
