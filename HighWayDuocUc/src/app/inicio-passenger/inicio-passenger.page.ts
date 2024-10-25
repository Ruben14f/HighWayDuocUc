import { CrearviajeService } from 'src/app/common/crearViaje/crearviaje.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../common/services/auth.service';
import { Subscription } from 'rxjs';
import { SolicitudesService } from '../common/services/solicitudes.service';


@Component({
  selector: 'app-inicio-passenger',
  templateUrl: './inicio-passenger.page.html',
  styleUrls: ['./inicio-passenger.page.scss'],
})
export class InicioPassengerPage implements OnInit {
  usuario: any;
  viajes: any[] = [];
  viajeCreado: any = null;
  isModalOpen = false; //Configuraciones
  isModalOpen2 = false; //Preguntas frecuentes
  isModalOpen3 = false; //Perfil
  isModalOpen4 = false; //Cambio de imagen de perfil
  isModalOpen5 = false; //Estado de viaje
  navController = inject(NavController);
  fotoPerfil: any;
  imagePreview: string | ArrayBuffer | null = null; // Inicializar en null
  uploadProgress: number = 0;
  userId: string = '';  // UID del usuario autenticado
  viajeSeleccionado: any = null; // Nueva variable para almacenar el viaje tomado
  mostrarEstadoViaje: boolean = false; // Controla la visibilidad del botón de estado de viaje
  yaTieneViaje: boolean = true;
  solicitudSubscription: Subscription | null = null;





  constructor(
    private alertController: AlertController,
    private router: Router,
    private dataService: DataService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private _authService: AuthService,
    private crearViajeService: CrearviajeService,
    private toastController: ToastController,
    private solicitud: SolicitudesService
  ) { }

  sedes: Sede[] = [];
  sedeSeleccionada: number | null = null;

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

    this.obtenerViajes();
    this.obtenerSedes();


    const viajeCreado = localStorage.getItem('viajeCreado');
    this.viajeCreado = viajeCreado ? JSON.parse(viajeCreado) : null;

    if (this.usuario?.sede) {
      this.usuario.sede = this.usuario.sede.replace(/^Sede\s+/i, '');
    }
    const viaje = localStorage.getItem('viajeCreado');
    if (viaje) {
      this.viajeCreado = JSON.parse(viaje);
    }
    this.dataService.getSedes().subscribe((sedes) => {
      this.sedes = sedes;
    });


    // Cargar la imagen de perfil directamente desde Firestore
    this.auth.user.subscribe(async user => {
      if (user) {
        this.userId = user.uid; // Guardamos el UID del usuario autenticado
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


  }


  obtenerViajes() {
    this.crearViajeService.obtenerViajes().subscribe(viajes => {
      this.viajes = viajes;
      // Guardar viajes en localStorage
      this.actualizarViajesEnLocalStorage();
    });
  }

  obtenerSedes() {
    this.dataService.getSedes().subscribe(sedes => {
      this.sedes = sedes;
    });
  }

  filtrarPorSede(event: any) {
    let sede = event.detail.value;
    console.log('Sede seleccionada originalmente:', sede);

    if (sede) {
      sede = sede.replace(/^Sede\s*/i, '').trim();
      console.log('Sede normalizada para búsqueda:', sede);

      this.crearViajeService.obtenerViajesPorSede(sede).subscribe(viajes => {
        console.log('Viajes obtenidos:', viajes);
        this.viajes = viajes;
      }, error => {
        console.error('Error al obtener viajes:', error);
      });
    } else {
      this.obtenerViajes();
    }
  }

  ionViewWillEnter() {
    this.auth.user.subscribe(async user => {
      if (user) {
        this.userId = user.uid;
        try {
          this.usuario = await this._authService.getUserData(this.userId);
          if (this.usuario && this.usuario.fotoPerfil) {
            this.imagePreview = this.usuario.fotoPerfil; // Cargar la imagen de perfil del usuario
          } else {
            this.imagePreview = 'assets/img/avatar.png'; // Imagen predeterminada si no hay imagen
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario', error);
        }
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }


  // Método para mostrar un Toast
  async mostrarToast(mensaje: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000, // Duración en milisegundos
      position: 'middle',
      color: color,
    });
    toast.present();
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
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((fotoUrlPerfil) => {
              this.actualizarPerfil(fotoUrlPerfil);
            });
          })
        ).subscribe();
      } else {
        this.actualizarPerfil(this.usuario.fotoPerfil || ''); // Mantener la imagen anterior si no se sube una nueva
      }
    } else {
      console.error('No se encontró el usuario registrado.');
    }
  }

  // Función para actualizar los datos del usuario en Firestore
  actualizarPerfil(fotoUrlPerfil: string) {
    const usuarioRef = this.firestore.collection('usuarios').doc(this.userId);
    usuarioRef.update({
      fotoPerfil: fotoUrlPerfil // Guardar la URL de la imagen en Firestore
    }).then(() => {
      this.imagePreview = fotoUrlPerfil; // Actualiza la vista inmediatamente
    }).catch((error) => {
      console.error('Error al actualizar el usuario en Firestore', error);
    });
  }

  // Función para manejar la selección de archivo de imagen
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




  irHistorialViajes() {
    this.router.navigate(['/travel-history']);
  }




  //Modo conductor
  async modoConductor() {
    if (this.usuario) {
      if (!this.usuario.tipoVehiculo || !this.usuario.matricula) {
        const alert = await this.alertController.create({
          header: 'Registro de Vehículo',
          message: 'Al parecer, usted no tiene registrado su vehículo, ¿le gustaría registrar su vehículo para iniciar el Modo Conductor?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Ok',
              handler: () => {
                this.router.navigate(['/register-driver']);
              }
            }
          ]
        });

        await alert.present();
      } else {
        this.router.navigate(['/inicio-conductor']);
      }
    }
  }

  //Para el tema de olvidar la contraseña
  mantencion() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  //Para el perfil
  perfilUsuario() {
    this.isModalOpen2 = true;
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen2 = isOpen;
  }
  //Para las preguntas frecuentes
  preguntas() {
    this.isModalOpen3 = true;
  }
  closePreguntas() {
    this.isModalOpen3 = false;
  }

  //Para la imagen de perfil
  imgPerfil() {
    this.isModalOpen4 = true;
  }
  closeImgPerfil() {
    this.isModalOpen4 = false;
  }
  ModalEstadoViaje() {
    this.isModalOpen5 = true;
  }
  closeModalEstadoViaje() {
    this.isModalOpen5 = false;
  }

  //Sonidito para el error de la ruedita
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }


  tomarViaje(viaje: any) {
    if (!viaje.id) {
      console.error('El viaje no tiene un ID válido.');
      return;
    }

    // Verificar si el viaje tiene pasajeros disponibles
    if (viaje.pasajeros === 0) {
      this.alertController.create({
        header: 'Viaje no disponible',
        message: 'No quedan asientos disponibles para este viaje.',
        buttons: ['OK']
      }).then(alert => alert.present());
      return; // Salir si no hay pasajeros disponibles
    }

    // Verificar si el usuario ya tiene un viaje activo
    if (this.usuario.viajeActivo) {
      this.alertController.create({
        header: 'Error',
        message: 'Ya tienes un viaje activo. No puedes solicitar otro viaje.',
        buttons: ['OK']
      }).then(alert => alert.present());
      return; // No permitir tomar otro viaje
    }

    const destino = viaje.destino || 'Destino no especificado';

    // Obtener el conductorId (userId) del viaje antes de crear la solicitud
    const conductorId = viaje.userId; // Aquí obtenemos el userId del conductor desde el documento del viaje


    // Crear la solicitud
    this.solicitud.crearSolicitud(viaje.id, this.usuario.uid, conductorId, destino, this.usuario.nombre, this.usuario.apellido )
      .then((solicitudCreada) => {
        this.alertController.create({
          header: 'Solicitud Enviada',
          message: 'Tu solicitud de viaje ha sido enviada al conductor.',
          buttons: ['OK']
        }).then(alert => alert.present());

        // Aquí llamamos al método para observar los cambios de estado de la solicitud
        this.observarEstadoSolicitud(solicitudCreada.id); // Observar cambios en la solicitud

        this.usuario.viajeActivo = true; // Establecer que el usuario tiene un viaje activo
        localStorage.setItem('usuarioRegistrado', JSON.stringify(this.usuario)); // Actualiza el localStorage
      })
      .catch(error => {
        console.error('Error al enviar la solicitud de viaje:', error);
        this.alertController.create({
          header: 'Error',
          message: 'Ocurrió un error al enviar tu solicitud de viaje. Inténtalo de nuevo más tarde.',
          buttons: ['OK']
        }).then(alert => alert.present());
      });
  }

  // Método para observar los cambios de estado de la solicitud
observarEstadoSolicitud(solicitudId: string) {
  this.solicitudSubscription = this.solicitud.observarCambiosDeSolicitud(solicitudId).subscribe(solicitud => {
    if (solicitud.estado === 'aceptada') {
      this.mostrarToast('Tu solicitud de viaje ha sido aceptada por el conductor.', 'success');
      this.mostrarEstadoViaje = true;
      this.viajeSeleccionado = solicitud.viajeId;

    } else if (solicitud.estado === 'rechazada') {
      this.mostrarToast('Tu solicitud de viaje ha sido rechazada por el conductor. Intenta con otro.', 'danger');
      this.mostrarEstadoViaje = false;
      this.usuario.viajeActivo = false;

      localStorage.setItem('usuarioRegistrado', JSON.stringify(this.usuario));
    } else if (solicitud.estado === 'cancelada') {
      this.mostrarToast('El conductor ha cancelado el viaje. Puedes tomar otro.', 'danger');

      this.mostrarEstadoViaje = false;
      this.usuario.viajeActivo = false;
      localStorage.setItem('usuarioRegistrado', JSON.stringify(this.usuario));
    }
  });
}



  async cancelarViaje() {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Deseas cancelar el viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelación de viaje cancelada');
          }
        },
        {
          text: 'Sí',
          handler: async () => {
            if (this.viajeSeleccionado) {
              let pasajerosDisponibles = parseInt(this.viajeSeleccionado.pasajeros) + 1; // Libera un pasajero

              // Actualiza la información del viaje en Firestore
              this.crearViajeService.actualizarViaje(this.viajeSeleccionado.id, { pasajeros: pasajerosDisponibles })
                .then(async () => {
                  console.log('Viaje cancelado y actualizado en Firestore');

                  // Muestra la alerta de éxito
                  const successAlert = await this.alertController.create({
                    header: 'Éxito',
                    message: 'Viaje cancelado',
                    buttons: ['OK'],
                  });
                  await successAlert.present();
                  this.closeModalEstadoViaje();
                  this.viajeSeleccionado = null; // Reinicia el viaje seleccionado
                  this.usuario.viajeActivo = false; // Establece que el usuario ya no tiene un viaje activo
                  this.mostrarEstadoViaje = false;
                  this.yaTieneViaje = true;
                  localStorage.setItem('usuarioRegistrado', JSON.stringify(this.usuario)); // Actualiza el localStorage
                })
                .catch(error => {
                  console.error('Error al cancelar el viaje en Firestore:', error);
                });
            }
          }
        }
      ]
    });

    await confirmAlert.present(); // Muestra la alerta de confirmación
  }





  // Función para actualizar los viajes en el localStorage
  private actualizarViajesEnLocalStorage() {
    localStorage.setItem('viajes', JSON.stringify(this.viajes));

  }



  actualizarViajeEnFirestore(viajeId: string, viajeActualizado: any) {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId);

    viajeRef.update({
      pasajeros: viajeActualizado.pasajeros // Actualiza la cantidad de pasajeros
    }).then(() => {
      console.log('Viaje actualizado en Firestore');
    }).catch((error) => {
      console.error('Error al actualizar el viaje en Firestore:', error);
    });
  }

  async viajeTomado() {
    const alert = await this.alertController.create({
      header: '¡Viaje tomado!',
      message: 'El viaje ha sido tomado con éxito.',
      buttons: ['OK']
    })
    await alert.present();

  }

  async eliminarViaje() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se puede tomar viaje ya que no quedan puesto disponible',
      buttons: ['OK']
    })
    await alert.present();
  }

  async viajeCancelado() {
    const alert = await this.alertController.create({
      header: 'Exito',
      message: 'Viaje cancelado',
      buttons: ['OK']
    })
    await alert.present();
  }

  // logout utilizando el authService
  logout() {
    this.setOpen(false);
    this._authService.logout().then(() => {
      // Elimina la imagen de perfil del localStorage al cerrar sesión
      localStorage.removeItem('perfilImage');
      this.imagePreview = null; // Resetea la vista de la imagen
      this.router.navigate(['/login']); // Redirigir al login
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

}
