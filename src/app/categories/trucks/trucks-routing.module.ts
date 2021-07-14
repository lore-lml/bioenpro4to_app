import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrucksPage } from './trucks.page';

const routes: Routes = [
  {
    path: '',
    component: TrucksPage,
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
export class TrucksPageRoutingModule {}
