import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  password: string = ''; // Aqui se almacena el valor que se ingreso en el campo para contraseña
  passwordType: string = 'password'; // tipo del campo de entrada de la contraseña (Oculta en este caso por los *****)

  constructor() {}

  togglePasswordVisibility() {
    // Alterna el tipo de campo entre password y text, Si passwordType es password cambiara a text y esto hara que sea visible la contraseña, de lo contrario sera password y la ocultara
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

}
