import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Sede } from '../register/info-sedes/sede.model';

@Component({
  selector: 'app-create-travel',
  templateUrl: './create-travel.page.html',
  styleUrls: ['./create-travel.page.scss'],
})
export class CreateTravelPage implements OnInit {

  crearViajeForm: FormGroup;
  navController = inject(NavController);
  usuario: any;
  sedes: Sede[] = [];

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder) {

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

    if (this.usuario?.sede) {
      this.usuario.sede = this.usuario.sede.replace(/^Sede\s+/i, '');
    }

    // Mostrar valores del formulario
    this.crearViajeForm.patchValue({
      salida: this.usuario?.sede || '',
      destino: this.usuario?.lugar || ''
    });
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

  // Alerta para el erro de hora fuera del rango de horario permitido
  async errorDeHora() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, selecciona una hora entre las 19:00 y las 00:00 del día.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Crear viaje
  async paraCrearViaje() {
    if (this.crearViajeForm.valid) {
      const viajeCreado = {
        salida: this.crearViajeForm.value.salida,
        destino: this.crearViajeForm.value.destino,
        hora: this.crearViajeForm.value.hora,
        pasajeros: this.crearViajeForm.value.pasajeros,
        precio: this.crearViajeForm.value.precio,
        metodoDePago: this.crearViajeForm.value['metodoPago']
      };

      if (this.usuario?.tipoVehiculo == 'moto'){
        if (viajeCreado.pasajeros > 1) {
          await this.errorMasPasajeros();
          return;
        }
      }


      // Guardar en localStorage
      localStorage.setItem('viajeCreado', JSON.stringify(viajeCreado));


      // Navegar o realizar acciones adicionales
      console.log('Viaje creado:', viajeCreado);
      await this.alertaDeViajeCreado();
    } else {
      await this.errorDeFormulario();
    }
  }

  // Alerta de error al elegir mas pasajeros
  async errorMasPasajeros() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No puedes elegir más de 1 pasajeros.',
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
