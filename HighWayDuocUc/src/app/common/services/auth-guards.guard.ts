import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuardsGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth); // Inyectamos el servicio de Firebase Auth
  const router = inject(Router); // Inyectamos el Router para redirección

  return afAuth.authState.pipe(
    map(user => {
      if (user) {
        // Si el usuario está autenticado, permite el acceso
        return true;
      } else {
        // Si no está autenticado, redirigir al login
        router.navigate(['/login']);
        return false;
      }
    })
  ) as Observable<boolean>; // Nos aseguramos de que retorne un Observable<boolean>
};
