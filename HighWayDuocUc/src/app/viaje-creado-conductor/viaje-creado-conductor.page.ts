import { Component, OnInit,inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';

@Component({
  selector: 'app-viaje-creado-conductor',
  templateUrl: './viaje-creado-conductor.page.html',
  styleUrls: ['./viaje-creado-conductor.page.scss'],
})
export class ViajeCreadoConductorPage implements OnInit {

  usuario : any;
  viajeCreado: any;

  navController = inject(NavController);



  constructor(private dataService: DataService) { }

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

  async volver(){
    this.navController.pop();
  }
}
