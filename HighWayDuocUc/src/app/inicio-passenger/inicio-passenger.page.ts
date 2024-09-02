import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-passenger',
  templateUrl: './inicio-passenger.page.html',
  styleUrls: ['./inicio-passenger.page.scss'],
})
export class InicioPassengerPage {

  constructor(private router: Router) { }

  irHistorialViajes() {
    this.router.navigate(['/travel-history']);
  }

}
