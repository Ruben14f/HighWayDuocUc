import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
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


  constructor(private router: Router,
    private auth: AngularFireAuth,
    private _authService: AuthService,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

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
  };

  ionViewWillEnter() {
    // Obtener información del usuario autenticado
    this.auth.user.subscribe(async user => {
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



  //Para el tema de olvidar la contraseña
  mantencion() {
    this.isModalOpen = true;
    this.reproducirError();
  }

  closeModal() {
    this.isModalOpen = false;
  }
  //Modo Pasajero
  modoPasajero() {
    this.router.navigate(['/inicio-passenger'])
  }


  imgPerfil() {
    this.isModalOpen4 = true;
  }
  closeImgPerfil() {
    this.isModalOpen4 = false;
  }

  //Para el perfil
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
  //Sonidito para el error de la ruedita
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
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




