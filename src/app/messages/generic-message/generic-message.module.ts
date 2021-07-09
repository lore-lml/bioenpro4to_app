import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericMessagePageRoutingModule } from './generic-message-routing.module';

import { GenericMessagePage } from './generic-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenericMessagePageRoutingModule
  ],
  declarations: [GenericMessagePage]
})
export class GenericMessagePageModule {}
