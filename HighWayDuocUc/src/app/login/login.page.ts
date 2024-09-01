import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  isModalOpen = false;

  password: string = ''; // Aqui se almacena el valor que se ingreso en el campo para contraseña
  passwordType: string = 'password'; // tipo del campo de entrada de la contraseña (Oculta en este caso por los *****)

  constructor(private router: Router) {}

  paraRegistros() {
    this.router.navigate(['/point-register']);
  }

  //Para el tema de olvidar la contraseña
  olvidoSuContrasenia() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  togglePasswordVisibility() {
    // Alterna el tipo de campo entre password y text, Si passwordType es password cambiara a text y esto hara que sea visible la contraseña, de lo contrario sera password y la ocultara
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }


}
