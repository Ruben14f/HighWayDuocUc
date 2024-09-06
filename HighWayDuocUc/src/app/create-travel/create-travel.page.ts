import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Sede } from '../register/info-sedes/sede.model';

@Component({
  selector: 'app-create-travel',
  templateUrl: './create-travel.page.html',
  styleUrls: ['./create-travel.page.scss'],
})
export class CreateTravelPage implements OnInit, AfterViewInit {

  crearViajeForm: FormGroup;

  navController = inject(NavController);
  usuario: any;
  sedes: Sede[] = [];

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder){

      this.crearViajeForm = this.formBuilder.group({
        salida: ['', Validators.required],
        destino:['', Validators.required],
        hora: ['', Validators.required],
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

     // Establecer valores en el formulario
    this.crearViajeForm.patchValue({
      salida: this.usuario?.sede || '',
      destino: this.usuario?.lugar || ''
    });
  }

  ngAfterViewInit() {
    const inputHoraSalida = document.getElementById('hora-salida') as HTMLInputElement;

    if (inputHoraSalida) {
      inputHoraSalida.addEventListener('input', async () => {
        const horaSeleccionada = inputHoraSalida.value;

        // Verificar si la hora seleccionada está fuera del rango permitido
        if (horaSeleccionada < '19:00' && horaSeleccionada > '00:00') {
          await this.errorDeHora();
          inputHoraSalida.value = ''; // Vacía el campo si la hora está fuera del rango permitido
        }
      });
    }
  }
  async errorDeHora() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, selecciona una hora entre las 19:00 y las 00:00 del día.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  //crear viaje
  async paraCrearViaje() {
    if (this.crearViajeForm.valid) {
      const viajeCreado = {
        salida: this.crearViajeForm.value.salida,
        destino: this.crearViajeForm.value.destino,
        hora: this.crearViajeForm.value.hora,
        pasajeros: this.crearViajeForm.value.pasajeros,
        precio: this.crearViajeForm.value.precio,
        metodoDePago: this.crearViajeForm.value['metodo-de-pago']
      };

      // Save to localStorage
      localStorage.setItem('viajeCreado', JSON.stringify(viajeCreado));

      // Navigate or perform further actions
      console.log('Viaje creado:', viajeCreado);
      await this.alertaDeViajeCreado();
    } else {
      await this.errorDeFormulario();
    }
  }

 // alertas que indican si el viaje se creo o no
  async alertaDeViajeCreado() {
    const alert = await this.alertController.create({
      header: '¡Viaje Creado!',
      message: 'El viaje ha sido creado exitosamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async errorDeFormulario() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, completa todos los campos.',
      buttons: ['OK']
    });
    await alert.present();
  }



  async volver() {
    this.navController.pop();
  }
}
