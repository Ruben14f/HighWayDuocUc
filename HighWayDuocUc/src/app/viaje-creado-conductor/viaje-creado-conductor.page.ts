import { Component, OnInit,inject } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../common/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
      const viajeSnapshot = await this.afs
        .collection('viajes', (ref) => ref.where('userId', '==', this.userId))
        .get()
        .toPromise();

      if (viajeSnapshot && !viajeSnapshot.empty) {
        const viajeDoc = viajeSnapshot.docs[0]; // Asume que solo hay un viaje por usuario
        const viajeData = viajeDoc.data(); // Datos del viaje

        // Mover el documento a viajeHistorial
        await this.afs.collection('viajeHistorial').add(viajeData);

        // Eliminar el documento de la colección original
        await this.afs.collection('viajes').doc(viajeDoc.id).delete();

        // Limpia los datos del viaje en localStorage
        localStorage.removeItem('viajeCreado');

        // Mostrar alerta de éxito
        await this.finaliza3();
      } else {
        console.log('No se encontró ningún viaje para este usuario.');
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
            this.NavController.pop(); // Redirigir a la página anterior
          },
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


  //Para el tema de olvidar la contraseña
  solicitudes() {
    this.isModalOpen = true;
    this.reproducirError();
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
