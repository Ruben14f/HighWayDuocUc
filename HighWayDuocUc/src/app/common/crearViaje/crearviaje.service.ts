import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrearviajeService {
  constructor(private firestore: AngularFirestore) { }

  // Guardar viaje en Firestore
  crearViaje(viaje: any) {
    return this.firestore.collection('viajes').add(viaje)
      .then(() => {
        console.log('Viaje creado exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear el viaje:', error);
        throw error;
      });
  }

  // Obtener todos los viajes
  obtenerViajes() {
    return this.firestore.collection('viajes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any; // Obtiene los datos del documento
        const id = a.payload.doc.id; // Obtiene el ID del documento
        return { id, ...data }; // Retorna un objeto que incluye el ID
      })),
      catchError((error) => {
        console.error('Error al obtener viajes:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  obtenerViajesPorSede(sede: string): Observable<any[]> {
    const sedeNormalizada = sede.replace(/^Sede\s*/i, '').trim();
    console.log('Buscando viajes para sede normalizada:', sedeNormalizada);

    return this.firestore.collection('viajes', ref => ref.where('salida', '==', sedeNormalizada))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })),
        catchError((error) => {
          console.error('Error al obtener viajes por sede:', error);
          return of([]);
        })
      );
  }

  actualizarViaje(viajeId: string, data: any) {
    return this.firestore.collection('viajes').doc(viajeId).update(data)
      .then(() => {
        console.log('Viaje actualizado en Firestore');
      })
      .catch((error) => {
        console.error('Error al actualizar el viaje en Firestore:', error);
      });
  }

  // Método para crear una solicitud de viaje

  crearSolicitud(viajeId: string, pasajeroId: string, destino: string, comentarios?: string) {
    const solicitud = {
      viajeId: viajeId,
      pasajeroId: pasajeroId,
      estado: 'pendiente',
      fechaSolicitud: new Date().toISOString(),
      destino: destino,
      comentarios: comentarios || ''
    };

    return this.firestore.collection('solicitudes').add(solicitud)
      .then(() => {
        console.log('Solicitud de viaje creada exitosamente');
      })
      .catch((error) => {
        console.error('Error al crear la solicitud de viaje:', error);
        throw error;
      });
  }

  obtenerSolicitudesPorConductor(conductorId: string): Observable<any[]> {
    return this.firestore.collection('solicitudes', ref => ref.where('conductorId', '==', conductorId))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })),
        catchError((error) => {
          console.error('Error al obtener solicitudes:', error);
          return of([]);
        })
      );
  }



  aceptarSolicitud(solicitudId: string) {
    return this.firestore.collection('solicitudes').doc(solicitudId).update({
        estado: 'aceptada' // Cambia el estado a 'aceptada'
    });
}

rechazarSolicitud(solicitudId: string) {
    return this.firestore.collection('solicitudes').doc(solicitudId).update({
        estado: 'rechazada' // Cambia el estado a 'rechazada'
    });
}





}
