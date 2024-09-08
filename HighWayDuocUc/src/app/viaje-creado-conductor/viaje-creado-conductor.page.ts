import { Component, OnInit,inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viaje-creado-conductor',
  templateUrl: './viaje-creado-conductor.page.html',
  styleUrls: ['./viaje-creado-conductor.page.scss'],
})
export class ViajeCreadoConductorPage implements OnInit {
  isModalOpen = false;

  usuario : any;
  viajeCreado: any;

  navController = inject(NavController);

  constructor(private dataService: DataService, private router: Router) { }

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
