import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyChannelsPage } from './daily-channels.page';
import {GenericMessagePage} from './generic-message/generic-message.page';

const routes: Routes = [
  {
    path: '',
    component: DailyChannelsPage
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
export class DailyChannelsPageRoutingModule {}
