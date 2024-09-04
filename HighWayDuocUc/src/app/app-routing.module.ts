import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PasajeroBienvenidaPageModule } from './point-register/pasajero-bienvenida/pasajero-bienvenida.module';
import { ConductorBienvenidaPage } from './point-register/conductor-bienvenida/conductor-bienvenida.page';
import { ConductorBienvenidaPageModule } from './point-register/conductor-bienvenida/conductor-bienvenida.module';

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
  {
    path: 'inicio-conductor',
    loadChildren: () => import('./register-driver/inicio-conductor/inicio-conductor.module').then( m => m.InicioConductorPageModule)
  },
  {
    path: 'welcome2',
    loadChildren: () => import('./point-register/conductor-bienvenida/conductor-bienvenida.module').then( m => m.ConductorBienvenidaPageModule)
  },  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
