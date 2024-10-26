import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DateService } from '../services/date.service';

@Injectable({
  providedIn: 'root'
})
export class CrearviajeService {
  constructor(private firestore: AngularFirestore,
              private date: DateService
  ) { }

  // Guardar viaje en Firestore
  async crearViaje(viaje: any, nombreConductor: string, apellidoConductor: string) {
    try {
      // Obtener la fecha actual desde la API
      const fechaActual = await this.date.getFechaActual();
      const fechaFormateada = fechaActual.currentDateTime.split('T')[0]; // Formatear la fecha (quitar la hora)

      const nuevoViaje = {
        ...viaje,
        nombreConductor: nombreConductor,
        apellidoConductor: apellidoConductor,
        fechaCreacion: fechaFormateada, // Guardar la fecha de creación obtenida de la API
        estado: 'activo' // El viaje se marca como activo cuando se crea
      };

      // Guardar el nuevo viaje en la colección 'viajes' en Firestore
      await this.firestore.collection('viajes').add(nuevoViaje);
      console.log('Viaje creado exitosamente con el conductor:', nombreConductor);

    } catch (error) {
      console.error('Error al crear el viaje:', error);
      throw error;
    }
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

  tieneViajeActivo(userId: string): Observable<any[]> {
    return this.firestore.collection('viajes', ref =>
      ref.where('userId', '==', userId).where('estado', '==', 'activo')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any; // Obtener los datos del documento
        const id = a.payload.doc.id; // Obtener el ID del documento
        return { id, estado: data.estado, userId: data.userId }; // Retornar solo el estado y userId
      })),
      catchError((error) => {
        console.error('Error al verificar si hay viajes activos:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  // Obtener historial de viajes creados por el conductor
  obtenerViajeHistorialConductor(userId: string): Observable<any[]> {
    return this.firestore.collection('viajeHistorial', ref => ref.where('userId', '==', userId))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        })),
        catchError((error) => {
          console.error('Error al obtener el historial de viajes del conductor:', error);
          return of([]); // Retorna un array vacío en caso de error
        })
      );
  }


  obtenerViajeHistorialPasajero(pasajeroId: string) {
    return this.firestore.collection('viajeHistorial', ref =>
      ref.where('pasajeroIds', 'array-contains', pasajeroId) // Busca el id dentro de la lista de IDs
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  observarEstadoViaje(viajeId: string): Observable<string> {
    return this.firestore.collection('viajes').doc(viajeId).valueChanges().pipe(
      map((viaje: any) => viaje?.estado) // Asegúrate de que viaje?.estado esté definido
    );
  }

// CrearviajeService
observarViajeFinalizado(pasajeroId: string): Observable<boolean> {
    return this.firestore.collection('viajeHistorial', ref =>
      ref.where('pasajeroIds', 'array-contains', pasajeroId).where('estado', '==', 'finalizado')
    ).snapshotChanges().pipe(
      map(actions => actions.length > 0), // Retorna true si hay un viaje finalizado
      catchError((error) => {
        console.error('Error al observar estado de viaje en viajeHistorial:', error);
        return of(false); // Retorna false en caso de error
      })
    );
  }


  // CrearviajeService
actualizarEstadoSolicitud(solicitudId: string, nuevoEstado: string) {
  return this.firestore.collection('solicitudes').doc(solicitudId).update({ estado: nuevoEstado })
    .then(() => {
      console.log(`Estado de la solicitud actualizado a ${nuevoEstado}`);
    })
    .catch(error => {
      console.error('Error al actualizar el estado de la solicitud:', error);
    });
}




  obtenerUsuarioPorId(userId: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(userId).valueChanges();
  }
}
