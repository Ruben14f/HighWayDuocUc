import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-inicio-conductor',
  templateUrl: './inicio-conductor.page.html',
  styleUrls: ['./inicio-conductor.page.scss'],
})
export class InicioConductorPage implements OnInit {
  usuario : any;
  userId: string = '';
  isModalOpen = false;

  isModalOpen2 = false;

  dataService: any;


  constructor(private router: Router,
              private auth: AngularFireAuth,
              private _authService: AuthService
            ) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;
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

  //Para el tema de olvidar la contraseña
  mantencion() {
    this.isModalOpen = true;
    this.reproducirError();
  }

  closeModal() {
    this.isModalOpen = false;
  }
  //Modo Pasajero
  modoPasajeror() {
    this.router.navigate(['/inicio-passenger'])
  }

  //Para el perfil
  perfilUsuario() {
    this.isModalOpen2 = true;
  }
 setOpen(isOpen: boolean) {
  this.isModalOpen2 = isOpen;
}
  //Sonidito para el error de la ruedita
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

  async cambiarModo(){
    this.router.navigate(['/inicio-passenger']);
  }

  async crearViaje(){
    this.router.navigate(['/create-travel']);
  }

  async irViajeCreado(){
    this.router.navigate(['/viaje-creado-conductor']);
  }


  logout() {
    this.setOpen(false);

    setTimeout(() => {
      localStorage.removeItem('usuarioRegistrado');
      localStorage.removeItem('viajeCreado');
      this.router.navigate(['/login']);
    }, 200);
  }
}




