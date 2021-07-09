import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {CategoryGuard} from './security/category.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'trucks',
    canActivate: [CategoryGuard],
    loadChildren: () => import('./categories/trucks/trucks.module').then(m => m.TrucksPageModule)
  },
  {
    path: 'scales',
    canActivate: [CategoryGuard],
    loadChildren: () => import('./categories/scales/scales.module').then(m => m.ScalesPageModule)
  },
  {
    path: 'biocells',
    canActivate: [CategoryGuard],
    loadChildren: () => import('./categories/biocells/biocells.module').then(m => m.BiocellsPageModule)
  },
  {
    path: '**',
    redirectTo: 'tabs/tab1'
  },  {
    path: 'generic-message',
    loadChildren: () => import('./messages/generic-message/generic-message.module').then( m => m.GenericMessagePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
