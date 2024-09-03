import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterDriverPage } from './register-driver.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterDriverPage
  },  {
    path: 'inicio-conductor',
    loadChildren: () => import('./inicio-conductor/inicio-conductor.module').then( m => m.InicioConductorPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterDriverPageRoutingModule {}
