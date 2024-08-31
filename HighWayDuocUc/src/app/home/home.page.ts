import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  password: string = ''; // Aqui se almacena el valor que se ingreso en el campo para contraseña
  passwordType: string = 'password'; // tipo del campo de entrada de la contraseña (Oculta en este caso por los *****)

  constructor() {}

  togglePasswordVisibility() {
    // Alterna el tipo de campo entre password y text, Si passwordType es password cambiara a text y esto hara que sea visible la contraseña, de lo contrario sera password y la ocultara
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
}
