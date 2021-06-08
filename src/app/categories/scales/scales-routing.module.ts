import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScalesPage } from './scales.page';

const routes: Routes = [
  {
    path: '',
    component: ScalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScalesPageRoutingModule {}
