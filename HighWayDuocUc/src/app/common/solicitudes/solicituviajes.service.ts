import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudViajeService {

  constructor(private firestore: AngularFirestore) { }

  // Método para enviar una solicitud de viaje
  enviarSolicitud(solicitud: any): Promise<void> {
    return this.firestore.collection('solicitudesViaje').add(solicitud)
      .then(() => {
        console.log('Solicitud de viaje enviada');
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        throw error; // Propaga el error para que pueda ser manejado en el componente
      });
  }

  // Método para obtener todas las solicitudes de viaje para el conductor
  obtenerSolicitudes(): Observable<any[]> {
    return this.firestore.collection('solicitudesViaje', ref => ref.where('estado', '==', 'pendiente')).valueChanges();
  }

  // Método para actualizar el estado de una solicitud
  actualizarEstadoSolicitud(solicitudId: string, estado: string): Promise<void> {
    return this.firestore.collection('solicitudesViaje').doc(solicitudId).update({ estado })
      .then(() => {
        console.log(`Solicitud ${estado} con ID ${solicitudId}`);
      })
      .catch(error => {
        console.error(`Error al actualizar la solicitud ${solicitudId}:`, error);
        throw error; // Propaga el error para que pueda ser manejado en el componente
      });
  }
}
