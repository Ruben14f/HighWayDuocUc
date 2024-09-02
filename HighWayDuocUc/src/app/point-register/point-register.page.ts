import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-point-register',
  templateUrl: './point-register.page.html',
  styleUrls: ['./point-register.page.scss'],
})
export class PointRegisterPage {

  navController = inject(NavController);


  constructor(private router: Router, private alertController: AlertController) { }

  async paraPasajero() {
    // Mostrar mensaje de "Registro correcto"
    const alert = await this.alertController.create({
      header: 'Registro correcto',
      message: 'Te has registrado como Pasajero exitosamente.',
      buttons: ['OK'],
    });
    await alert.present();

    // Redirigir a la pantalla de login después de cerrar el mensaje
    alert.onDidDismiss().then(() => {
      this.router.navigate(['/login']);
    });
  }

  paraConductor() {
    this.router.navigate(['/register-driver']);
  }

  async volver(){
    this.navController.pop()
  }

}
