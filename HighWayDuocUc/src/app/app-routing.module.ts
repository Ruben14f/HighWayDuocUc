import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuardsGuard } from './common/services/auth-guards.guard';


const routes: Routes = [
  {
    path: 'pre-home',
    loadChildren: () => import('./home/pre-home/pre-home/pre-home.module').then( m => m.PreHomePageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'pre-home',
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
    loadChildren: () => import('./register-driver/register-driver.module').then( m => m.RegisterDriverPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'point-register',
    loadChildren: () => import('./point-register/point-register.module').then( m => m.PointRegisterPageModule)
  },
  {
    path: 'inicio-passenger',
    loadChildren: () => import('./inicio-passenger/inicio-passenger.module').then( m => m.InicioPassengerPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'travel-history',
    loadChildren: () => import('./travel-history/travel-history.module').then( m => m.TravelHistoryPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'travel-history-conductor',
    loadChildren: () => import('./travel-history/travel-history-conductor/travel-history-conductor.module').then( m => m.TravelHistoryConductorPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./point-register/pasajero-bienvenida/pasajero-bienvenida.module').then( m => m.PasajeroBienvenidaPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'inicio-conductor',
    loadChildren: () => import('./register-driver/inicio-conductor/inicio-conductor.module').then( m => m.InicioConductorPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'welcome2',
    loadChildren: () => import('./point-register/conductor-bienvenida/conductor-bienvenida.module').then( m => m.ConductorBienvenidaPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'create-travel',
    loadChildren: () => import('./create-travel/create-travel.module').then( m => m.CreateTravelPageModule),
    canActivate: [authGuardsGuard]
  },
  {
    path: 'viaje-creado-conductor',
    loadChildren: () => import('./viaje-creado-conductor/viaje-creado-conductor.module').then( m => m.ViajeCreadoConductorPageModule),
    canActivate: [authGuardsGuard]
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
