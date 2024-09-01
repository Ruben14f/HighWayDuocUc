import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-point-register',
  templateUrl: './point-register.page.html',
  styleUrls: ['./point-register.page.scss'],
})
export class PointRegisterPage {

  constructor(private router: Router) { }

  paraPasajero() {
    this.router.navigate(['/register']);
  }
  paraConductor() {
    this.router.navigate(['/register-driver']);
  }


}
