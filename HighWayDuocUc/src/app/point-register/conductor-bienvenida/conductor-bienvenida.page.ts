import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conductor-bienvenida',
  templateUrl: './conductor-bienvenida.page.html',
  styleUrls: ['./conductor-bienvenida.page.scss'],
})
export class ConductorBienvenidaPage implements OnInit {

  cnombreUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    if (usuarioRegistrado) {
      const usuario = JSON.parse(usuarioRegistrado);
      this.cnombreUsuario = usuario.correo;

      // Redirige a la pantalla de inicio después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/inicio-conductor']);
      }, 3000); // 3 segundos
    } else {
      // Si no hay usuario en localStorage, redirige al login
      this.router.navigate(['/login']);
    }
  }

}
