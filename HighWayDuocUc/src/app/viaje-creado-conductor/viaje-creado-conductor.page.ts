import { Component, OnInit,inject } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Sede } from '../register/info-sedes/sede.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../common/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-viaje-creado-conductor',
  templateUrl: './viaje-creado-conductor.page.html',
  styleUrls: ['./viaje-creado-conductor.page.scss'],
})
export class ViajeCreadoConductorPage implements OnInit {
  isModalOpen = false;

  usuario : any;
  userId: string = '';
  viajeCreado: any;


  constructor(private router: Router,
              private _authService: AuthService,
              private auth: AngularFireAuth,
              private afs: AngularFirestore,
              private NavController: NavController,
              private alertController: AlertController
            ) { }

  sedes: Sede[] = [];
  sedeSeleccionada: number | null = null;

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

    const viajeCreado = localStorage.getItem('viajeCreado');
    this.viajeCreado = viajeCreado ? JSON.parse(viajeCreado) : null;

  }


  ionViewWillEnter() {
    // Obtener información del usuario autenticado
    this.auth.user.subscribe(async user => {
      if (user) {
        this.userId = user.uid; // Guardamos el UID del usuario autenticado
        try {
          // Obtener el viaje del usuario
          const viajeSnapshot = await this.afs.collection('viajes', ref => ref.where('userId', '==', this.userId)).get().toPromise();

          if (viajeSnapshot && !viajeSnapshot.empty) {
            const viajeDoc = viajeSnapshot.docs[0]; // Asume que solo hay un viaje por usuario
            const viajeData = viajeDoc.data(); // Datos del viaje

            // Cargar los datos del viaje en la variable para mostrarlos en la página
            this.viajeCreado = viajeData;

            console.log('Datos del viaje cargados correctamente.');
          } else {
            console.log('No se encontró un viaje para el usuario.');
          }
        } catch (error) {
          console.error('Error al cargar el viaje', error);
        }
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }
  async finalizarCarrera() {
    try {

      // Obtener el viaje del usuario desde Firestore
      const viajeObservable = this.afs
        .collection('viajes', (ref) => ref.where('userId', '==', this.userId))
        .get();

      const viajeSnapshot = await lastValueFrom(viajeObservable);

      if (viajeSnapshot && !viajeSnapshot.empty) {
        const viajeDoc = viajeSnapshot.docs[0];
        const viajeData: any = viajeDoc.data();

        console.log("Datos del viaje antes de mover al historial:", viajeData);

        // Verificar si hay pasajeros aceptados y obtener sus IDS
        const pasajerosAceptados = viajeData.pasajerosAceptados || [];
        const pasajeroIds = pasajerosAceptados.map((pasajero: any) => pasajero.pasajeroId);

        // Crear nuevo objeto con la lista de IDs de pasajeros
        const nuevoViajeData = {
          ...viajeData,
          pasajeroIds: pasajeroIds, // Añadir la lista de IDs de pasajeros
          estado: 'finalizado'
        };

        // Mover el documento a viajeHistorial con los cambios
        await this.afs.collection('viajeHistorial').add(nuevoViajeData);

        // Eliminar el documento de la colección original de 'viajes'
        await this.afs.collection('viajes').doc(viajeDoc.id).delete();

        // Limpia los datos del viaje en localStorage
        localStorage.removeItem('viajeCreado');

        // Mostrar alerta de éxito
        await this.finaliza3();

      } else {
        await this.errorFinaliza3();
      }
    } catch (error) {
      console.error('Error al finalizar la carrera y mover los datos:', error);
    }
  }




  // Método para mostrar alerta
  async finaliza3() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'El viaje se ha finalizado y movido al historial.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.NavController.pop();
          },
        },
      ],
    });

    await alert.present(); // Muestra la alerta
  }
  // Método para mostrar alerta
  async errorFinaliza3() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Usted no tiene creado ningún viaje. Puede crear un viaje en el apartado "Crear Viaje" en el inicio',
      buttons: [
        {
          text: 'Ok',
        },
      ],
    });
    await alert.present(); // Muestra la alerta
  }


  // Función para capitalizar la primera letra
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }


  closeModal() {
    this.isModalOpen = false;
  }
  async volver(){
    this.NavController.pop()
  }

  //Sonidito para el olvido de contra
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
}
