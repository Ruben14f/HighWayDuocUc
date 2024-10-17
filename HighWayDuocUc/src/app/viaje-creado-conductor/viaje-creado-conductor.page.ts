import { Component, OnInit,inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../common/services/auth.service';

@Component({
  selector: 'app-viaje-creado-conductor',
  templateUrl: './viaje-creado-conductor.page.html',
  styleUrls: ['./viaje-creado-conductor.page.scss'],
})
export class ViajeCreadoConductorPage implements OnInit {
  isModalOpen = false;

  usuario : any;
  userId: string = '';
  viajeCreado: any;


  navController = inject(NavController);

  constructor(private router: Router,
              private _authService: AuthService,
              private auth: AngularFireAuth) { }

  sedes: Sede[] = [];
  sedeSeleccionada: number | null = null;

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

    const viajeCreado = localStorage.getItem('viajeCreado');
    this.viajeCreado = viajeCreado ? JSON.parse(viajeCreado) : null;

  }


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

  // Función para capitalizar la primera letra
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }


  //Para el tema de olvidar la contraseña
  solicitudes() {
    this.isModalOpen = true;
    this.reproducirError();
  }

  closeModal() {
    this.isModalOpen = false;
  }
  volver(){
    this.router.navigate(['/inicio-conductor']);
  }

  //Sonidito para el olvido de contra
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
}
