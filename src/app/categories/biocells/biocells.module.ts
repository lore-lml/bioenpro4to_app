import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiocellsPageRoutingModule } from './biocells-routing.module';

import { BiocellsPage } from './biocells.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiocellsPageRoutingModule
  ],
  declarations: [BiocellsPage]
})
export class BiocellsPageModule {}