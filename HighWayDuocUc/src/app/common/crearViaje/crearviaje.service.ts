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
        fechaCreacion: fechaFormateada
      };

      // Guardar el nuevo viaje en la colección 'viajes' en Firestore
      await this.firestore.collection('viajes').add(nuevoViaje);
      console.log('Viaje creado exitosamente con el conductor:', nombreConductor);

    } catch (error) {
      console.error('Error al crear el viaje:', error);
      throw error;
    }
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

      // Verificar que el viaje tiene el campo 'pasajeros'
      const viajeData = viajeDoc.data() as { pasajeros: number, pasajerosAceptados?: any[] } | undefined;

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

        // Preparar los datos de la solicitud que se van a mover a la colección 'viajes'
        const pasajeroAceptado = {
          nombre: solicitudData.nombre,
          apellido: solicitudData.apellido,
          pasajeroId: solicitudData.pasajeroId,
        };

        // Actualizar la cantidad de pasajeros y agregar el pasajero aceptado al viaje
        const nuevosPasajerosAceptados = viajeData.pasajerosAceptados ? [...viajeData.pasajerosAceptados, pasajeroAceptado] : [pasajeroAceptado];
        transaction.update(viajeRef, { pasajeros: nuevosPasajeros, pasajerosAceptados: nuevosPasajerosAceptados });

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
  // Obtener todos los viajes por id del historial
  obtenerViajeHistorial() {
    return this.firestore.collection('viajeHistorial').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any; // Obtiene los datos del documento
        const id = a.payload.doc.id; // Obtiene el ID del documento
        return { id, ...data }; // Retorna un objeto que incluye el ID
      })),
      catchError((error) => {
        console.error('Error al obtener viajeHistorial:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  obtenerUsuarioPorId(userId: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(userId).valueChanges();
  }
}
