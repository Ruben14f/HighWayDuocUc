import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';


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
  emailReset: string = '';

  constructor(private router: Router,
    private afAuth: AngularFireAuth,
    private AlertController: AlertController,
  ) {}

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
  async iniciarSesion(){
    try{
      await this.afAuth.setPersistence('local');
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if(userCredential.user){
        const nombreUsuario = userCredential.user.displayName || this.email;
        localStorage.setItem('usuarioRegistrado', JSON.stringify({correo: nombreUsuario}))
        this.router.navigate(['/welcome'])
      }
    }catch(error){
      this.mostrarAlertaError('El correo o la contraseña son incorrectos. Por favor, inténtelo de nuevo.');
    }
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.AlertController.create({
      header: 'Error',
      subHeader: 'Credenciales Incorrectas',
      message: mensaje,
      buttons: ['Ok']
    })

    await alert.present();
  }

  // Método para enviar correo de recuperación de contraseña
  async recuperarContra() {
    if (!this.emailReset) {
      this.mostrarAlertaError('Por favor, ingrese un correo válido.');
      return;
    }

    try {
      await this.afAuth.sendPasswordResetEmail(this.emailReset);
      this.mostrarAlerta('Correo enviado', 'Se ha enviado un correo para restablecer tu contraseña.');
      this.closeModal();
    } catch (error) {
      this.mostrarAlertaError('No se pudo enviar el correo. Verifica si el correo ingresado es correcto.');
    }
  }

  async mostrarAlerta(header: string, mensaje: string) {
    const alert = await this.AlertController.create({
      header: header,
      message: mensaje,
      buttons: ['Ok']
    });
    await alert.present();
  }
}



