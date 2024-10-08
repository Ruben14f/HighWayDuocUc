import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-conductor',
  templateUrl: './inicio-conductor.page.html',
  styleUrls: ['./inicio-conductor.page.scss'],
})
export class InicioConductorPage implements OnInit {
  usuario : any;
  isModalOpen = false;

  isModalOpen2 = false;

  dataService: any;


  constructor(private router: Router) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;
    };

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
    setTimeout(() => {
      window.location.reload()
    }, 1000)
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




