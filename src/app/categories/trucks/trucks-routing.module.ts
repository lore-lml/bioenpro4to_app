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
    loadChildren: () => import('./truck-channels/truck-channels.module').then(m => m.TruckChannelsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrucksPageRoutingModule {}
