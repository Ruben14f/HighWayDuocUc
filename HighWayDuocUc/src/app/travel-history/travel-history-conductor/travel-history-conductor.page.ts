import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-travel-history-conductor',
  templateUrl: './travel-history-conductor.page.html',
  styleUrls: ['./travel-history-conductor.page.scss'],
})
export class TravelHistoryConductorPage implements OnInit {
  usuario: any;
  userId: string = '';
  viajeHistorial: any[] = [];
  navController = inject(NavController);
  CrearviajeService: any;

  constructor(
    private auth: AngularFireAuth,
    private _authService: AuthService,
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

    this.obtenerViajeHistorial();
  }

  ionViewWillEnter() {
    this.auth.user.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
        console.log("User ID:", this.userId); // Verificar si se obtiene correctamente el userId

        // Llamamos a la función que obtiene el historial de viajes filtrado por pasajeroId
        this.obtenerViajeHistorial();
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }


  obtenerViajeHistorial() {
    this.CrearviajeService.obtenerViajeHistorial().subscribe((viajes: any[]) => {
      this.viajeHistorial = viajes;
    });
  }


  async volver() {
    this.navController.pop();
  }
}
