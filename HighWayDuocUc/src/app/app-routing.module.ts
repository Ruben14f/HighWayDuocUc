import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PasajeroBienvenidaPageModule } from './point-register/pasajero-bienvenida/pasajero-bienvenida.module';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'point-register',
    loadChildren: () => import('./point-register/point-register.module').then( m => m.PointRegisterPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'register-driver',
    loadChildren: () => import('./register-driver/register-driver.module').then( m => m.RegisterDriverPageModule)
  },
  {
    path: 'point-register',
    loadChildren: () => import('./point-register/point-register.module').then( m => m.PointRegisterPageModule)
  },
  {
    path: 'inicio-passenger',
    loadChildren: () => import('./inicio-passenger/inicio-passenger.module').then( m => m.InicioPassengerPageModule)
  },
  {
    path: 'travel-history',
    loadChildren: () => import('./travel-history/travel-history.module').then( m => m.TravelHistoryPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./point-register/pasajero-bienvenida/pasajero-bienvenida.module').then( m => m.PasajeroBienvenidaPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
