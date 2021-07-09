import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiocellChannelsPage } from './biocell-channels.page';

const routes: Routes = [
  {
    path: '',
    component: BiocellChannelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiocellChannelsPageRoutingModule {}
