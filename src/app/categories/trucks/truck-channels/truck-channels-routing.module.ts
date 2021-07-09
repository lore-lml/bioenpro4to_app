import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TruckChannelsPage } from './truck-channels.page';

const routes: Routes = [
  {
    path: '',
    component: TruckChannelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckChannelsPageRoutingModule {}
