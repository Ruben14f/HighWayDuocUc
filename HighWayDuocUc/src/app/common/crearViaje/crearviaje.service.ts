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
  crearSolicitud(viajeId: string, pasajeroId: string, conductorId: string, destino: string, comentarios?: string) {
    const solicitud = {
      viajeId: viajeId,
      pasajeroId: pasajeroId,
      conductorId: conductorId, // Usa el conductorId pasado como parámetro
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

  // Obtener solicitudes pendientes para un conductor específico
  obtenerSolicitudesPorConductor(conductorId: string) {
    return this.firestore.collection('solicitudes', ref => ref.where('conductorId', '==', conductorId).where('estado', '==', 'pendiente'))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
  // Aceptar solicitud de un pasajero y actualizar asientos
  aceptarSolicitud(solicitudId: string, viajeId: string) {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId).ref;
    const solicitudRef = this.firestore.collection('solicitudes').doc(solicitudId).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const viajeDoc = await transaction.get(viajeRef);

      if (!viajeDoc.exists) {
        throw new Error('El viaje no existe');
      }

      // Asegurarse de que el tipo de datos devuelto incluye pasajeros
      const viajeData = viajeDoc.data() as { pasajeros: number } | undefined;

      if (viajeData?.pasajeros !== undefined && viajeData.pasajeros > 0) {
        const nuevosPasajeros = viajeData.pasajeros - 1;

        // Actualizamos el número de pasajeros en el viaje
        transaction.update(viajeRef, { pasajeros: nuevosPasajeros });

        // Actualizamos el estado de la solicitud
        transaction.update(solicitudRef, { estado: 'aceptada' });

        console.log('Solicitud aceptada y asientos actualizados');
      } else {
        throw new Error('No hay asientos disponibles o el campo "pasajeros" no es válido');
      }
    });
  }

  notificarConductorCancelacion(conductorId: string, pasajeroId: string, pasajeroNombre: string) {
    // Crear el objeto de notificación (o actualizar una colección de notificaciones en Firestore)
    const notificacion = {
      conductorId: conductorId,
      mensaje: `El pasajero ${pasajeroNombre} ha cancelado su viaje.`,
      pasajeroId: pasajeroId,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };

    // Guardar la notificación en una colección de notificaciones
    return this.firestore.collection('notificaciones').add(notificacion)
      .then(() => {
        console.log('Notificación enviada al conductor.');
      })
      .catch((error) => {
        console.error('Error al enviar la notificación al conductor:', error);
        throw error;
      });
  }


  // Rechazar solicitud de un pasajero
  rechazarSolicitud(solicitudId: string) {
    return this.firestore.collection('solicitudes').doc(solicitudId).update({
      estado: 'rechazada'
    });
  }

// Obtener solicitudes pendientes y sus cambios para el pasajero
  obtenerSolicitudesPorPasajero(pasajeroId: string) {
    return this.firestore.collection('solicitudes', ref =>
      ref.where('pasajeroId', '==', pasajeroId)
    ).snapshotChanges();
  }
}
