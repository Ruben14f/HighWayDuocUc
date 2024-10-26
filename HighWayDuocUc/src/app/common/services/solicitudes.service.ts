import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map } from 'rxjs/operators';
import { of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(private firestore: AngularFirestore) { }

  // Método para crear una solicitud de viaje
crearSolicitud(viajeId: string, pasajeroId: string, conductorId: string, destino: string, nombre: string, apellido: string, comentarios?: string): Promise<any> {
  const solicitud = {
    viajeId: viajeId,
    pasajeroId: pasajeroId,
    conductorId: conductorId,
    estado: 'pendiente',
    fechaSolicitud: new Date().toISOString(),
    nombre: nombre,
    apellido: apellido,
    destino: destino,
    comentarios: comentarios || ''
  };

  return this.firestore.collection('solicitudes').add(solicitud)
    .then((docRef) => {
      console.log('Solicitud de viaje creada exitosamente con ID:', docRef.id);
      return { id: docRef.id, ...solicitud }; // Retorna el ID del documento junto con los datos
    })
    .catch((error) => {
      console.error('Error al crear la solicitud de viaje:', error);
      throw error;
    });
}


  // Obtener solicitudes pendientes para un conductor específico
  obtenerSolicitudesPorConductor(conductorId: string) {
    console.log('Conductor ID para la consulta:', conductorId); // Verifica el conductorId

    return this.firestore.collection('solicitudes', ref =>
      ref.where('conductorId', '==', conductorId).where('estado', '==', 'pendiente'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          console.log('Solicitudes Firestore:', actions); // Verifica qué estás obteniendo
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
        catchError((error) => {
          console.error('Error al obtener solicitudes:', error);
          return of([]); // Retorna un array vacío en caso de error
        })
      );
  }




  // Aceptar solicitud de un pasajero y actualizar asientos
  aceptarSolicitud(solicitudId: string, viajeId: string) {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId).ref;
    const solicitudRef = this.firestore.collection('solicitudes').doc(solicitudId).ref;

    return this.firestore.firestore.runTransaction(async (transaction) => {
      // Obtener el documento del viaje
      const viajeDoc = await transaction.get(viajeRef);

      if (!viajeDoc.exists) {
        throw new Error('El viaje no existe');
      }

      const viajeData = viajeDoc.data() as { pasajeros: number, pasajerosAceptados?: any[], pasajeroIds?: string[] } | undefined;

      if (viajeData?.pasajeros !== undefined && viajeData.pasajeros > 0) {
        const nuevosPasajeros = viajeData.pasajeros - 1;

        // Obtener los datos de la solicitud
        const solicitudDoc = await transaction.get(solicitudRef);
        if (!solicitudDoc.exists) {
          throw new Error('La solicitud no existe');
        }

        const solicitudData = solicitudDoc.data() as { nombre: string, apellido: string, pasajeroId: string } | undefined;
        if (!solicitudData) {
          throw new Error('Datos de solicitud inválidos');
        }

        // Actualizar el estado de la solicitud a 'aceptada'
        transaction.update(solicitudRef, { estado: 'aceptada' });

        // Agregar el `pasajeroId` a `pasajeroIds` y el objeto completo a `pasajerosAceptados`
        const pasajeroAceptado = {
          nombre: solicitudData.nombre,
          apellido: solicitudData.apellido,
          pasajeroId: solicitudData.pasajeroId,
        };
        const nuevosPasajerosAceptados = viajeData.pasajerosAceptados ? [...viajeData.pasajerosAceptados, pasajeroAceptado] : [pasajeroAceptado];
        const nuevosPasajeroIds = viajeData.pasajeroIds ? [...viajeData.pasajeroIds, solicitudData.pasajeroId] : [solicitudData.pasajeroId];

        // Actualizar el documento del viaje con los nuevos datos
        transaction.update(viajeRef, { pasajeros: nuevosPasajeros, pasajerosAceptados: nuevosPasajerosAceptados, pasajeroIds: nuevosPasajeroIds });

        console.log('Solicitud aceptada, asientos actualizados y datos movidos al viaje');
      } else {
        throw new Error('No hay asientos disponibles o el campo "pasajeros" no es válido');
      }
    });
  }



  // Escuchar los cambios de estado de una solicitud específica
// Escuchar los cambios de estado de una solicitud específica
observarCambiosDeSolicitud(solicitudId: string) {
  return this.firestore.collection('solicitudes').doc(solicitudId).snapshotChanges().pipe(
    map(a => {
      const data = a.payload.data() as any;
      const id = a.payload.id;
      return { id, ...data };
    })
  );
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
