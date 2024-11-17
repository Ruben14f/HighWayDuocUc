import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-home',
  templateUrl: './pre-home.page.html',
  styleUrls: ['./pre-home.page.scss'],
})
export class PreHomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Espera 3 segundos, redirige a la página principal y hace un refresh
    setTimeout(() => {
      this.router.navigate(['/home']).then(() => {
        window.location.reload();// Fuerza un refresh de la página principal
      });
    }, 3000); // 3000 milisegundos = 3 segundos
  }
}
