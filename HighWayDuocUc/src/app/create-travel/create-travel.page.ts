import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl  } from '@angular/forms';
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
      pasajeros: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      precio: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
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


  normalizarHora(hora: string): string {
    if (!hora) return '';
    const [horas, minutos] = hora.split(':');
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;
  }

  async validarHora(control: AbstractControl) {
    const horaSeleccionada = control.value;

    if (!horaSeleccionada) {
      return { horaInvalida: true };
    }

    const horaRegex24 = /^([01]?\d|2[0-3]):([0-5]?\d)$/;  // Formato 24 horas
    const horaRegex12 = /^(0?[1-9]|1[0-2]):([0-5][0-9]) ?(AM|PM)$/i; // Formato 12 horas (AM/PM)

    let horaNormalizada: string;
    let horas: number;
    let minutos: number;

    if (horaRegex24.test(horaSeleccionada)) {
      const [hora, min] = horaSeleccionada.split(':');
      horas = parseInt(hora, 10);
      minutos = parseInt(min, 10);
      horaNormalizada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }

    else if (horaRegex12.test(horaSeleccionada)) {
      const [_, horasStr, minutosStr, periodo] = horaSeleccionada.match(horaRegex12);
      horas = parseInt(horasStr, 10);
      minutos = parseInt(minutosStr, 10);

      // Convertir a formato 24 horas
      if (periodo.toUpperCase() === 'PM' && horas < 12) {
        horas += 12; // Convertir PM a 24 horas
      }
      if (periodo.toUpperCase() === 'AM' && horas === 12) {
        horas = 0; // Convertir 12 AM a 00:00
      }

      horaNormalizada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    } else {
      return { horaInvalida: true };
    }

    const [horaFinal, minutosFinal] = horaNormalizada.split(':').map(num => parseInt(num, 10));
    if (horaFinal < 19 || (horaFinal === 19 && minutosFinal < 0) || horaFinal > 23 || (horaFinal === 23 && minutosFinal > 59)) {
      await this.errorDeHora();
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
      const horaNormalizada = this.normalizarHora(this.crearViajeForm.value.hora);

      const viajeCreado = {
        salida: this.crearViajeForm.value.salida,
        destino: this.crearViajeForm.value.destino,
        hora: horaNormalizada,
        pasajeros: Number(this.crearViajeForm.value.pasajeros),
        precio: Number(this.crearViajeForm.value.precio),
        metodoDePago: this.crearViajeForm.value['metodoPago'],
        userId: this.userId
      };

      console.log('Viaje creado:', viajeCreado);

      // Verificar si el vehículo es una moto y el número de pasajeros
      if (this.usuario?.tipoVehiculo == 'moto' && viajeCreado.pasajeros > 1) {
        await this.errorMasPasajeros();
        return;
      }

      try {
        await this.crearViajeService.crearViaje(viajeCreado, this.usuario?.nombre, this.usuario?.apellido);
        const alert = await this.alertController.create({
          header: 'Viaje creado',
          message: 'El viaje se ha creado exitosamente.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navController.pop();
            }
          }]
        });

        await alert.present();

      } catch (error) {
        console.error('Error al crear el viaje:', error);
        await this.errorDeFormulario();
      }
    } else {
      await this.errorDeFormulario();
    }
  }



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
