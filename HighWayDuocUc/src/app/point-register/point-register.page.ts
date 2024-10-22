import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../common/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-point-register',
  templateUrl: './point-register.page.html',
  styleUrls: ['./point-register.page.scss'],
})
export class PointRegisterPage {

  navController = inject(NavController);


  constructor(
    private router: Router,
    private alertController: AlertController,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,) { }

  async paraPasajero() {
    // Obtener el UID del usuario autenticado usando AngularFireAuth
    const user = await this.auth.currentUser;
    const userId = user?.uid;

    if (userId) {
      // Referencia al documento del usuario en Firestore
      const userDocRef = this.firestore.collection('usuarios').doc(userId);

      try {
        // Obtener el documento actual del usuario
        const userDocSnapshot = await userDocRef.get().toPromise(); // Obtener el snapshot de Firestore

        // Verificar si existe el documento
        if (userDocSnapshot && userDocSnapshot.exists) {
          // Actualizar el tipo de usuario como pasajero
          await userDocRef.update({
            tipoDeUsuario: 'pasajero'  // Establecer como pasajero
          });

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
        } else {
          console.error('Documento de usuario no encontrado.');
        }
      } catch (error) {
        console.error('Error al obtener o actualizar el documento del usuario:', error);
      }
    } else {
      console.error('No se encontró un usuario autenticado.');
    }
  }

  paraConductor() {
    this.router.navigate(['/register-driver']);
  }

  async volver() {
    this.navController.pop();
  }


}
