import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.page.html',
  styleUrls: ['./register-driver.page.scss'],
})
export class RegisterDriverPage{
  driverForm: FormGroup;
  usuario: any;  // Información del usuario autenticado
  tipoVehiculo: string = '';
  matricula: string = '';
  fotoVehiculo: any;
  uploadProgress: number = 0;
  userId: string = '';  // UID del usuario autenticado

  navController = inject(NavController);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth // Agregamos Firebase Auth para obtener el UID del usuario autenticado
  ) {
    this.driverForm = this.formBuilder.group({
      tipoVehiculo: ['', Validators.required],
      matricula: ['', Validators.required],
    })
  }



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

  async guardarDatosConductor() {
    if (this.driverForm.valid) {  // Cambiado a 'valid' para verificar el formulario
      if (this.usuario) {
        if (this.fotoVehiculo) {
          const filePath = `vehiculos/${this.userId}/fotoVehiculo.jpg`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.fotoVehiculo);

          task.percentageChanges().subscribe((progress) => {
            this.uploadProgress = progress || 0;
          });

          task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((fotoUrl) => {
                this.updateUserWithVehicleData(fotoUrl);
              });
            })
          ).subscribe();
        } else {
          this.updateUserWithVehicleData('');
        }
      } else {
        console.error('No se encontró el usuario registrado.');
      }
    } else {
      // Mostrar alerta si los datos no están completos
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Por favor, completa los campos obligatorios: Tipo de Vehículo y Matrícula.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Función para actualizar los datos del usuario en Firestore
  async updateUserWithVehicleData(fotoUrl: string) {
    const usuarioRef = this.firestore.collection('usuarios').doc(this.userId);

    try {
      // Obtener el documento actual del usuario
      const userDocSnapshot = await usuarioRef.get().toPromise();

      // Verificar si el documento de usuario existe antes de actualizar
      if (userDocSnapshot?.exists) {
        await usuarioRef.update({
          tipoVehiculo: this.driverForm.get('tipoVehiculo')?.value, // Usar los valores del form
          matricula: this.driverForm.get('matricula')?.value, // Usar los valores del form
          fotoVehiculo: fotoUrl,
          tipoDeUsuario: 'conductor'  // Establecer como conductor
        });

        // Redirigir al conductor a la página de bienvenida
        this.router.navigate(['/welcome2']);
      } else {
        console.error('Documento de usuario no encontrado.');
      }
    } catch (error) {
      console.error('Error al obtener o actualizar el documento del usuario:', error);
    }
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
