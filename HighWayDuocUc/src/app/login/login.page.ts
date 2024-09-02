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
  email: string = ''; // Aquí se almacena el valor que se ingresa en el campo de correo
  passwordType: string = 'password'; // tipo del campo de entrada de la contraseña (Oculta en este caso por los *****)

  constructor(private router: Router) {}

  paraRegistros() {
    this.router.navigate(['/register']);
  }

  //Para el tema de olvidar la contraseña
  olvidoSuContrasenia() {
    this.isModalOpen = true;
    this.reproducirError();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  togglePasswordVisibility() {
    // Alterna el tipo de campo entre password y text, Si passwordType es password cambiara a text y esto hara que sea visible la contraseña, de lo contrario sera password y la ocultara
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  //Sonidito para el olvido de contra
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
  // Nuevo método para manejar el inicio de sesión
  iniciarSesion() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    if (usuarioRegistrado) {
      const usuario = JSON.parse(usuarioRegistrado);

      if (usuario.correo === this.email && usuario.contraseña === this.password) {
        this.router.navigate(['/welcome']); // Redirigir al inicio si las credenciales son correctas
      } else {
        this.mostrarAlertaError();
      }
    } else {
      this.mostrarAlertaError();
    }
  }

  async mostrarAlertaError() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Error';
    alert.subHeader = 'Credenciales Incorrectas';
    alert.message = 'El correo o la contraseña son incorrectos. Por favor, inténtelo de nuevo.';
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }



}
