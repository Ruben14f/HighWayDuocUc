import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError } from 'rxjs/operators'; // Para manejar errores
import { of } from 'rxjs'; // Para manejar errores

@Injectable({
  providedIn: 'root'
})
export class CrearviajeService {

  constructor(private firestore: AngularFirestore) {}

  // Guardar viaje en Firestore
  crearViaje(viaje: any) {
    return this.firestore.collection('viajes').add(viaje)
      .then(() => {
        console.log('Viaje creado exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear el viaje:', error);
        throw error; // Lanza el error para que pueda ser manejado donde se llame
      });
  }

  // Obtener todos los viajes
  obtenerViajes() {
    return this.firestore.collection('viajes').valueChanges()
      .pipe(
        catchError((error) => {
          console.error('Error al obtener viajes:', error);
          return of([]); // Retorna un array vacío en caso de error
        })
      );
  }
}
