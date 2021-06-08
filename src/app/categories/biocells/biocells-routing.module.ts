import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiocellsPage } from './biocells.page';

const routes: Routes = [
  {
    path: '',
    component: BiocellsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiocellsPageRoutingModule {}
