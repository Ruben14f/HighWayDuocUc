import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pasajero-bienvenida',
  templateUrl: './pasajero-bienvenida.page.html',
  styleUrls: ['./pasajero-bienvenida.page.scss'],
})
export class PasajeroBienvenidaPage implements OnInit {

  cnombreUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    if (usuarioRegistrado) {
      const usuario = JSON.parse(usuarioRegistrado);
      this.cnombreUsuario = usuario.nombre;

      // Redirige a la pantalla de inicio después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/inicio-passenger']);
      }, 3000); // 3 segundos
    } else {
      // Si no hay usuario en localStorage, redirige al login
      this.router.navigate(['/login']);
    }
  }

}
