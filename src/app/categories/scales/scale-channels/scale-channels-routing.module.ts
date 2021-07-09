import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScaleChannelsPage } from './scale-channels.page';

const routes: Routes = [
  {
    path: '',
    component: ScaleChannelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScaleChannelsPageRoutingModule {}
