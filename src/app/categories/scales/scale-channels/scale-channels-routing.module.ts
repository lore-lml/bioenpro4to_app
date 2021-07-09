import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScaleChannelsPage } from './scale-channels.page';
import {GenericMessagePage} from '../../../messages/generic-message/generic-message.page';

const routes: Routes = [
  {
    path: '',
    component: ScaleChannelsPage
  },
  {
    path: 'messages/:date',
    component: GenericMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScaleChannelsPageRoutingModule {}
