import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.page.html',
  styleUrls: ['./register-driver.page.scss'],
})
export class RegisterDriverPage{
  usuario: any;
  tipoVehiculo: string = '';
  matricula: string = '';

  navController = inject(NavController);

  constructor(private router: Router) { }

  ionViewWillEnter() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;
  }

  guardarDatosConductor() {
    if (this.usuario) {
      this.usuario.tipoVehiculo = this.tipoVehiculo;
      this.usuario.matricula = this.matricula;

      localStorage.setItem('usuarioRegistrado', JSON.stringify(this.usuario));

      this.router.navigate(['/welcome2']);
    } else {
      console.error('No se encontró el usuario registrado.');
    }
  }

  async volver(){
    this.navController.pop();
  }

}
