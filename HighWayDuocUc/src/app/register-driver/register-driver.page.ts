import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.page.html',
  styleUrls: ['./register-driver.page.scss'],
})
export class RegisterDriverPage {
  usuario: any;  // Información del usuario autenticado
  tipoVehiculo: string = '';
  matricula: string = '';
  fotoVehiculo: any;
  uploadProgress: number = 0;
  userId: string = '';  // UID del usuario autenticado

  navController = inject(NavController);

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth // Agregamos Firebase Auth para obtener el UID del usuario autenticado
  ) { }

  ionViewWillEnter() {
    // Obtener información del usuario autenticado
    this.auth.user.subscribe(user => {
      if (user) {
        this.usuario = user;
        this.userId = user.uid; // Guardamos el UID del usuario autenticado
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  guardarDatosConductor() {
    if (this.usuario) {
      if (this.fotoVehiculo) {
        // Guardar la imagen en una ruta personalizada basada en el UID del usuario
        const filePath = `vehiculos/${this.userId}/fotoVehiculo.jpg`; // Ruta donde se guardará la imagen
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fotoVehiculo);

        task.percentageChanges().subscribe((progress) => {
          this.uploadProgress = progress || 0;
        });

        // Obtener la URL de descarga una vez que la imagen esté subida
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((fotoUrl) => {
              // Actualizar los datos del usuario con la URL de la imagen subida
              this.updateUserWithVehicleData(fotoUrl);
            });
          })
        ).subscribe();
      } else {
        // Si no se sube una imagen, de todos modos actualizar los datos del vehículo
        this.updateUserWithVehicleData('');
      }
    } else {
      console.error('No se encontró el usuario registrado.');
    }
  }

  // Función para actualizar los datos del usuario en Firestore
  updateUserWithVehicleData(fotoUrl: string) {
    // Usamos el UID del usuario autenticado para acceder a su documento
    const usuarioRef = this.firestore.collection('usuarios').doc(this.userId);

    usuarioRef.update({
      tipoVehiculo: this.tipoVehiculo,
      matricula: this.matricula,
      fotoVehiculo: fotoUrl // Guardar la URL de la imagen en Firestore
    }).then(() => {
      this.router.navigate(['/welcome2']); // Navega a otra página tras el registro
    }).catch((error) => {
      console.error('Error al actualizar el usuario en Firestore', error);
    });
  }

  // Función para manejar la selección de archivo de imagen
  onFileSelected(event: any) {
    this.fotoVehiculo = event.target.files[0]; // Almacena el archivo seleccionado
  }

  // Función para volver a la pantalla anterior
  async volver() {
    this.navController.pop();
  }
}
