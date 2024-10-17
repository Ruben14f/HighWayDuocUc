import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../common/services/auth.service';


@Component({
  selector: 'app-inicio-passenger',
  templateUrl: './inicio-passenger.page.html',
  styleUrls: ['./inicio-passenger.page.scss'],
})
export class InicioPassengerPage implements OnInit {
  usuario: any;
  viajesCreado: any = null;
  isModalOpen = false; //Configuraciones
  isModalOpen2 = false; //Preguntas frecuentes
  isModalOpen3 = false; //Perfil
  isModalOpen4 = false; //Cambio de imagen de perfil
  navController = inject(NavController);
  fotoPerfil: any;
  imagePreview: string | ArrayBuffer | null = null; // Inicializar en null
  uploadProgress: number = 0;
  userId: string = '';  // UID del usuario autenticado



  constructor(
    private alertController: AlertController,
    private router: Router,
    private dataService: DataService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private _authService: AuthService,
  ) { }
  sedes: Sede[] = [];
  sedeSeleccionada: number | null = null;

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;


    if (this.usuario?.sede) {
      this.usuario.sede = this.usuario.sede.replace(/^Sede\s+/i, '');
    }
    const viaje = localStorage.getItem('viajeCreado');
    if (viaje) {
      this.viajesCreado = JSON.parse(viaje);
    }
    this.dataService.getSedes().subscribe((sedes) => {
      this.sedes = sedes;
    });
    this.filtrarPorSede();

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

  ionViewWillEnter() {
    this.auth.user.subscribe(async user => {
      if (user) {
        this.userId = user.uid;
        try {
          this.usuario = await this._authService.getUserData(this.userId);
          if (this.usuario && this.usuario.fotoPerfil) {
            this.imagePreview = this.usuario.fotoPerfil; // Cargar la imagen de perfil del usuario
          } else {
            this.imagePreview = 'ruta/a/imagen/predeterminada.jpg'; // Imagen predeterminada si no hay imagen
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario', error);
        }
      } else {
        console.error('No hay usuario autenticado');
      }
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




  filtrarPorSede(event?: any) {
    this.sedeSeleccionada = event?.detail?.value || null;

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

  //Sonidito para el error de la ruedita
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }







  //SE TOMA EL PASAJE POR EL PASAJERO Y LUEGO BAJA LA CANTIDAD DEL ASIENTO DISPONIBLE EN EL CODUCTOR
  tomarViaje() {
    const viajeGuardado = localStorage.getItem('viajeCreado');
    let viajeCreado = viajeGuardado ? JSON.parse(viajeGuardado) : null;

    if (viajeCreado) {
      viajeCreado.pasajeros = parseInt(viajeCreado.pasajeros) - 1;
      if (viajeCreado.pasajeros < 0) {
        this.eliminarViaje();
      } else {
        this.viajeTomado();
        localStorage.setItem('viajeCreado', JSON.stringify(viajeCreado));
      }
    }
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
