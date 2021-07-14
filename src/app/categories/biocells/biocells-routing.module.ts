import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiocellsPage } from './biocells.page';

const routes: Routes = [
  {
    path: '',
    component: BiocellsPage
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
export class BiocellsPageRoutingModule {}
