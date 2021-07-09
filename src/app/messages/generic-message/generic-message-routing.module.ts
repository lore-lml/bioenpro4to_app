import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericMessagePage } from './generic-message.page';

const routes: Routes = [
  {
    path: '',
    component: GenericMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericMessagePageRoutingModule {}
