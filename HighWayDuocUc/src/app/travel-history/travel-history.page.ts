import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CrearviajeService } from '../common/crearViaje/crearviaje.service';

@Component({
  selector: 'app-travel-history',
  templateUrl: './travel-history.page.html',
  styleUrls: ['./travel-history.page.scss'],
})
export class TravelHistoryPage implements OnInit {
  usuario: any;
  userId: string = '';
  viajeHistorial: any[] = [];
  navController = inject(NavController);
  CrearviajeService: any;

  constructor(
    private auth: AngularFireAuth,
    private crearViajeService: CrearviajeService,
  ) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;
  }

  ionViewWillEnter() {
    this.auth.user.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        console.log("User ID:", this.userId); // Verificar si se obtiene correctamente el userId

        // Llamar al servicio para obtener el historial de viajes
        this.obtenerViajeHistorial();
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  obtenerViajeHistorial() {
    if (!this.userId) {
      console.error("No se ha cargado el userId aún");
      return;
    }

    this.crearViajeService.obtenerViajeHistorialPasajero(this.userId).subscribe(viajes => {
      if (viajes.length > 0) {
        console.log('Historial de viajes del pasajero:', viajes);
        this.viajeHistorial = viajes;
      } else {
        console.log('No se encontraron viajes para este pasajero.');
      }
    }, error => {
      console.error('Error al obtener el historial de viajes del pasajero:', error);
    });
  }

  async volver() {
    this.navController.pop();
  }
}
