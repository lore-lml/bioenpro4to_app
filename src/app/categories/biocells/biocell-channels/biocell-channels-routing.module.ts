import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiocellChannelsPage } from './biocell-channels.page';
import {GenericMessagePage} from '../../../messages/generic-message/generic-message.page';

const routes: Routes = [
  {
    path: '',
    component: BiocellChannelsPage
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
export class BiocellChannelsPageRoutingModule {}
