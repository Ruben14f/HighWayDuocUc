import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { CrearviajeService } from 'src/app/common/crearViaje/crearviaje.service';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-inicio-conductor',
  templateUrl: './inicio-conductor.page.html',
  styleUrls: ['./inicio-conductor.page.scss'],
})
export class InicioConductorPage implements OnInit {
  usuario: any;
  userId: string = '';
  isModalOpen = false;
  isModalOpen2 = false;
  isModalOpen3 = false; //Perfil
  isModalOpen4 = false;
  imagePreview: string | ArrayBuffer | null = null;
  dataService: any;
  fotoPerfil: any;
  uploadProgress: number = 0;
  solicitudes: any[] = []; // Almacenar solicitudes

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private _authService: AuthService,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private crearViajeService: CrearviajeService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

    // Cargar la imagen de perfil directamente desde Firestore
    this.auth.user.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        this.obtenerSolicitudes()
        try {
          this.usuario = await this._authService.getUserData(this.userId);
          if (this.usuario && this.usuario.fotoPerfil) {
            this.imagePreview = this.usuario.fotoPerfil; // Carga la imagen directamente de Firestore
          } else {
            this.imagePreview = null;
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario', error);
        }
      }
    });

    this.auth.user.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid; // Guardamos el UID del usuario autenticado
        this.obtenerSolicitudes(); // Llamamos a obtener las solicitudes para el conductor
      }
    });
  }

  ionViewWillEnter() {
    // Obtener información del usuario autenticado
    this.auth.user.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid; // Guardamos el UID del usuario autenticado

        // Obtener datos del usuario desde Firestore
        try {
          this.usuario = await this._authService.getUserData(this.userId);
        } catch (error) {
          console.error('Error al obtener datos del usuario', error);
        }
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  obtenerSolicitudes() {
    if (!this.userId) {
      console.error('No hay conductor autenticado');
      return;
    }

    // Llama al método obtenerSolicitudesPorConductor del servicio
    this.crearViajeService.obtenerSolicitudesPorConductor(this.userId).subscribe((solicitudes) => {
      console.log('Solicitudes obtenidas:', solicitudes);  // Depuración
      this.solicitudes = solicitudes; // Asigna las solicitudes obtenidas a la variable
    }, error => {
      console.error('Error al obtener solicitudes:', error);
    });
  }
  // Aceptar solicitud de viaje
  aceptarSolicitud(solicitudId: string, viajeId: string) {
    this.crearViajeService.aceptarSolicitud(solicitudId, viajeId).then(() => {
      this.alertController.create({
        header: 'Solicitud Aceptada',
        message: 'Has aceptado la solicitud de viaje.',
        buttons: ['OK'],
      }).then((alert) => alert.present());
    }).catch((error) => {
      console.error('Error al aceptar la solicitud:', error);
    });
  }


  // Rechazar solicitud de viaje
  rechazarSolicitud(solicitudId: string) {
    this.crearViajeService.rechazarSolicitud(solicitudId).then(() => {
      this.alertController.create({
        header: 'Solicitud Rechazada',
        message: 'Has rechazado la solicitud de viaje.',
        buttons: ['OK'],
      }).then((alert) => alert.present());
    }).catch((error) => {
      console.error('Error al rechazar la solicitud:', error);
    });
  }

  guardarDatosConductor() {
    if (this.usuario) {
      if (this.fotoPerfil) {
        const filePath = `imagenes_perfil/${this.userId}/fotoPerfil.jpg`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fotoPerfil);

        task.percentageChanges().subscribe((progress) => {
          this.uploadProgress = progress || 0;
        });
        task.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((fotoUrlPerfil) => {
                this.actualizarPerfil(fotoUrlPerfil);
              });
            })
          )
          .subscribe();
      } else {
        this.actualizarPerfil(this.usuario.fotoPerfil || ''); // Mantener la imagen anterior si no se sube una nueva
      }
    } else {
      console.error('No se encontró el usuario registrado.');
    }
  }

  actualizarPerfil(fotoUrlPerfil: string) {
    const usuarioRef = this.firestore.collection('usuarios').doc(this.userId);
    usuarioRef.update({
      fotoPerfil: fotoUrlPerfil, // Guardar la URL de la imagen en Firestore
    }).then(() => {
      this.imagePreview = fotoUrlPerfil; // Actualiza la vista inmediatamente
    }).catch((error) => {
      console.error('Error al actualizar el usuario en Firestore', error);
    });
  }

  mantencion() {
    this.isModalOpen = true;
    this.reproducirError();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  modoPasajero() {
    this.router.navigate(['/inicio-passenger']);
  }

  imgPerfil() {
    this.isModalOpen4 = true;
  }

  closeImgPerfil() {
    this.isModalOpen4 = false;
  }

  perfilUsuario() {
    this.isModalOpen2 = true;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen2 = isOpen;
  }

  preguntas() {
    this.isModalOpen3 = true;
  }

  closePreguntas() {
    this.isModalOpen3 = false;
  }

  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    audio.play().catch((error) => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

  async cambiarModo() {
    this.router.navigate(['/inicio-passenger']);
  }

  async crearViaje() {
    this.router.navigate(['/create-travel']);
  }

  async irViajeCreado() {
    this.router.navigate(['/viaje-creado-conductor']);
  }
  async historialPasajero() {
    this.router.navigate(['/travel-history-conductor'])
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fotoPerfil = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  logout() {
    this.setOpen(false);
    this._authService.logout().then(() => {
      localStorage.removeItem('perfilImage');
      this.imagePreview = null;
      this.router.navigate(['/login']); // Redirigir al login
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
