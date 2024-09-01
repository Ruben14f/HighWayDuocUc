import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-point-register',
  templateUrl: './point-register.page.html',
  styleUrls: ['./point-register.page.scss'],
})
export class PointRegisterPage {
  
  navController = inject(NavController);


  constructor(private router: Router) { }

  /*paraPasajero() {
    this.router.navigate(['/register']);
  }*/
  paraConductor() {
    this.router.navigate(['/register-driver']);
  }

  async volver(){
    this.navController.pop()
  }

}
