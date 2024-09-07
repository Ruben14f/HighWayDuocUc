import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-passenger',
  templateUrl: './inicio-passenger.page.html',
  styleUrls: ['./inicio-passenger.page.scss'],
})
export class InicioPassengerPage implements OnInit{
  usuario : any;
  viajeCreado: any;
  isModalOpen = false;
  isModalOpen2 = false;
  navController = inject(NavController);

  constructor(private alertController: AlertController, private router: Router, private dataService: DataService) { }
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

    this.dataService.getSedes().subscribe((sedes) => {
      this.sedes = sedes;
    });


  }

  filtrarPorSede(event: any) {
    this.sedeSeleccionada = event.detail.value;
    // Aquí puedes agregar lógica para filtrar o hacer algo con la sede seleccionada


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
    this.reproducirError();
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

    // Reinicia la página para que se actualice el contador de pasajeros

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
