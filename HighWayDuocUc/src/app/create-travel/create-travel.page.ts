import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CrearviajeService } from '../common/crearViaje/crearviaje.service';


@Component({
  selector: 'app-create-travel',
  templateUrl: './create-travel.page.html',
  styleUrls: ['./create-travel.page.scss'],
})
export class CreateTravelPage implements OnInit {

  crearViajeForm: FormGroup;
  navController = inject(NavController);
  usuario: any;
  userId: string = '';

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private auth: AngularFireAuth,
    private crearViajeService: CrearviajeService) {

    // Inicializa el formulario con validaciones
    this.crearViajeForm = this.formBuilder.group({
      salida: ['', Validators.required],
      destino: ['', Validators.required],
      hora: ['', [Validators.required, this.validarHora.bind(this)]],
      pasajeros: ['', Validators.required],
      precio: ['', Validators.required],
      metodoPago: ['', Validators.required]
    });
  }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;
  }

  ionViewWillEnter() {
    // Obtener información del usuario autenticado
    this.auth.user.subscribe(async user => {
      if (user) {
        this.userId = user.uid; // Guardamos el UID del usuario autenticado
        // Obtener datos del usuario desde Firestore
        try {
          this.usuario = await this._authService.getUserData(this.userId);

          const sedeSinPalabra = this.usuario.sede ? this.usuario.sede.replace(/^Sede\s*/, '') : "";
          const destinoMayus = this.usuario.lugar;
          const primeraLetraMayus = this.capitalizeFirstLetter(destinoMayus);

          this.crearViajeForm.patchValue({
            salida: sedeSinPalabra,
            destino: primeraLetraMayus || '',
          });

        } catch (error) {
          console.error('Error al obtener datos del usuario', error);
        }
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  // Función para capitalizar la primera letra
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Validador personalizado para la hora
  validarHora(control: any) {
    const horaSeleccionada = control.value;
    // Verificar si la hora seleccionada está fuera del rango permitido (19:00 a 23:59)
    if (horaSeleccionada && (horaSeleccionada < '19:00' || horaSeleccionada >= '24:00')) {
      this.errorDeHora();
      return { horaInvalida: true };
    }
    return null;
  }

  // Alerta para el error de hora fuera del rango de horario permitido
  async errorDeHora() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, selecciona una hora entre las 19:00 y las 00:00 del día.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async paraCrearViaje() {
    if (this.crearViajeForm.valid) {
      const viajeCreado = {
        salida: this.crearViajeForm.value.salida,
        destino: this.crearViajeForm.value.destino,
        hora: this.crearViajeForm.value.hora,
        pasajeros: this.crearViajeForm.value.pasajeros,
        precio: this.crearViajeForm.value.precio,
        metodoDePago: this.crearViajeForm.value['metodoPago'],
        userId: this.userId // Incluye el ID del usuario que crea el viaje
      };

      // Verificar si el vehículo es una moto y el número de pasajeros
      if (this.usuario?.tipoVehiculo == 'moto') {
        if (viajeCreado.pasajeros > 1) {
          await this.errorMasPasajeros();
          return;
        }
      }

      try {
        // Llamar al servicio para crear el viaje
        await this.crearViajeService.crearViaje(viajeCreado, this.usuario?.nombre, this.usuario?.apellido);

        // Mostrar la alerta de confirmación
        const alert = await this.alertController.create({
          header: 'Viaje creado',
          message: 'El viaje se ha creado exitosamente.',
          buttons: [{
            text: 'OK',
            handler: () => {
              // Redirigir de vuelta a inicio-conductor
              this.navController.pop();
            }
          }]
        });

        await alert.present();

      } catch (error) {
        console.error('Error al crear el viaje:', error);
        await this.errorDeFormulario(); // Puedes mostrar una alerta de error aquí si lo prefieres
      }
    } else {
      await this.errorDeFormulario();
    }
  }



  // Alerta de error al elegir más pasajeros
  async errorMasPasajeros() {
    const alert = await this.alertController.create({
      header: 'Error (USO DE VEHICULO: MOTO)',
      message: 'No puede llevar a más de 1 persona en su moto.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Alerta de viaje creado
  async alertaDeViajeCreado() {
    const alert = await this.alertController.create({
      header: '¡Viaje Creado!',
      message: 'El viaje ha sido creado exitosamente.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/viaje-creado-conductor']);
  }

  // Alerta de error de formulario
  async errorDeFormulario() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, completa todos los campos.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Función para volver a la pantalla anterior
  async volver() {
    this.navController.pop();
  }
}
