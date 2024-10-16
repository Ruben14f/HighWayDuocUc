import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-inicio-passenger',
  templateUrl: './inicio-passenger.page.html',
  styleUrls: ['./inicio-passenger.page.scss'],
})
export class InicioPassengerPage implements OnInit{
  usuario : any;
  viajeCreado: any = null;
  isModalOpen = false; //Configuraciones
  isModalOpen2 = false; //Preguntas frecuentes
  isModalOpen3 = false; //Perfil
  isModalOpen4 = false; //Cambio de imagen de perfil
  navController = inject(NavController);
  fotoPerfil: any;
  uploadProgress: number = 0;
  userId: string = '';  // UID del usuario autenticado

  constructor(private alertController: AlertController, private router: Router, private dataService: DataService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth
  ) { }
  sedes: Sede[] = [];
  sedeSeleccionada: number | null = null;

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

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
    this.filtrarPorSede();

  }

  ionViewWillEnter() {
    // Obtener información del usuario autenticado
    this.auth.user.subscribe(user => {
      if (user) {
        this.usuario = user;
        this.userId = user.uid; // Guardamos el UID del usuario autenticado
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }
  guardarDatosConductor() {
    if (this.usuario) {
      if (this.fotoPerfil) {
        // Guardar la imagen en una ruta personalizada basada en el UID del usuario
        const filePath = `imagenes_perfil/${this.userId}/fotoPerfil.jpg`; // Ruta donde se guardará la imagen
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fotoPerfil);

        // Escuchar el progreso de la carga
        task.percentageChanges().subscribe((progress) => {
          this.uploadProgress = progress || 0;
        });

        // Obtener la URL de descarga una vez que la imagen esté subida
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((fotoUrlPerfil) => {
              // Actualizar los datos del usuario con la URL de la imagen subida
              this.actualizarPerfil(fotoUrlPerfil);
            });
          })
        ).subscribe();
      } else {
        // Si no se sube una imagen, de todos modos actualizar los datos del vehículo
        this.actualizarPerfil('');
      }
    } else {
      console.error('No se encontró el usuario registrado.');
    }
  }
  // Función para actualizar los datos del usuario en Firestore
  actualizarPerfil(fotoUrlPerfil: string) {
    // Usamos el UID del usuario autenticado para acceder a su documento
    const usuarioRef = this.firestore.collection('usuarios').doc(this.userId);

    usuarioRef.update({
      fotoPerfil: fotoUrlPerfil // Guardar la URL de la imagen en Firestore
    }).catch((error) => {
      console.error('Error al actualizar el usuario en Firestore', error);
    });
  }

  // Función para manejar la selección de archivo de imagen
  onFileSelected(event: any) {
    this.fotoPerfil = event.target.files[0]; // Almacena el archivo seleccionado
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
  preguntas(){
    this.isModalOpen3 = true;
  }
  closePreguntas(){
    this.isModalOpen3 = false;
  }
  //Para la imagen de perfil
  imgPerfil(){
    this.isModalOpen4 = true;
  }
  closeImgPerfil(){
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

  logout() {
    this.setOpen(false);

    setTimeout(() => {
      localStorage.removeItem('usuarioRegistrado');
      localStorage.removeItem('viajeCreado');
      this.router.navigate(['/login']);
    }, 200);
  }

  //SE TOMA EL PASAJE POR EL PASAJERO Y LUEGO BAJA LA CANTIDAD DEL ASIENTO DISPONIBLE EN EL CODUCTOR
  tomarViaje() {
    const viajeGuardado = localStorage.getItem('viajeCreado');
    let viajeCreado = viajeGuardado ? JSON.parse(viajeGuardado) : null;

    if (viajeCreado) {
      viajeCreado.pasajeros = parseInt(viajeCreado.pasajeros) - 1;
      if (viajeCreado.pasajeros < 0) {
        this.eliminarViaje();
      }else{
        this.viajeTomado();
        localStorage.setItem('viajeCreado', JSON.stringify(viajeCreado));

        // recarga la página para que se actualice el contador de pasajero
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }
  }


  async viajeTomado() {
    const alert = await this.alertController.create({
      header:'¡Viaje tomado!',
      message: 'El viaje ha sido tomado con éxito.',
      buttons: ['OK']
    })
    await alert.present();

  }

  async eliminarViaje() {
    const alert = await this.alertController.create({
      header:'Error',
      message: 'No se puede tomar viaje ya que no quedan puesto disponible',
      buttons: ['OK']
    })
    await alert.present();
  }


}
