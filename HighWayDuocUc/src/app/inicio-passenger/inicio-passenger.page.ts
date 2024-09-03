import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../register/info-sedes/data.service';
import { Sede } from '../register/info-sedes/sede.model';

@Component({
  selector: 'app-inicio-passenger',
  templateUrl: './inicio-passenger.page.html',
  styleUrls: ['./inicio-passenger.page.scss'],
})
export class InicioPassengerPage implements OnInit{
  usuario : any;
  isModalOpen = false;

  constructor(private router: Router, private dataService: DataService) { }
  sedes: Sede[] = [];
  sedeSeleccionada: number | null = null;

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

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
  //Para el tema de olvidar la contraseña
  mantencion() {
    this.isModalOpen = true;
    this.reproducirError();
  }

  closeModal() {
    this.isModalOpen = false;
  }
  //Sonidito para el error de la ruedita
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
}
