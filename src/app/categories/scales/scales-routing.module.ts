import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScalesPage } from './scales.page';

const routes: Routes = [
  {
    path: '',
    component: ScalesPage
  },
  {
    path: ':id',
    loadChildren: () => import('../../daily-channels/daily-channels.module').then(m => m.DailyChannelsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScalesPageRoutingModule {}
