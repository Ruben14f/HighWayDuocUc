import { Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import { Sede, Carrera } from '../register/info-sedes/sede.model';
import { DataService } from './info-sedes/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit{
  registerForm: FormGroup;
  sedes: Sede[] = [];
  carreras: Carrera[] = [];
  carrerasFiltradas: Carrera[] = [];

  navController = inject(NavController);

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private DataService: DataService,
    private alertController: AlertController) {

    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sede: ['', Validators.required],
      carrera: ['', Validators.required],
      lugar: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    })
   }
   ngOnInit() {
    // Obtener sedes y carreras desde el service (data.service.ts)
    this.DataService.getSedes().subscribe(sedes => this.sedes = sedes);
    this.DataService.getCarreras().subscribe(carreras => this.carreras = carreras);

    // Pa los changes de sede y filtreo
    this.registerForm.get('sede')?.valueChanges.subscribe(sedeId => {
      this.filtrarCarreras(sedeId);
      this.registerForm.get('carrera')?.setValue('');
    });
  }



  filtrarCarreras(sedeId: number) {
    this.carrerasFiltradas = this.carreras.filter(carrera => carrera.sedeId.includes(sedeId));
  }

  async paraRegistrarse() {
    if (this.registerForm.valid) {
      const sedeSeleccionada = this.sedes.find(sede => sede.id === this.registerForm.value.sede);
      const carreraSeleccionada = this.carreras.find(carrera => carrera.id === this.registerForm.value.carrera);

      const usuario = {
        nombre: this.registerForm.value.nombre,
        apellido: this.registerForm.value.apellido,
        sede: sedeSeleccionada ? sedeSeleccionada.nombre : '',
        carrera: carreraSeleccionada ? carreraSeleccionada.nombre : '',
        lugar: this.registerForm.value.lugar,
        correo: this.registerForm.value.correo,
        contraseña: this.registerForm.value.contraseña
      };

      console.log('Usuario a registrar:', usuario);  // Esto te permitirá ver qué datos se están guardando

      localStorage.setItem('usuarioRegistrado', JSON.stringify(usuario));

      this.router.navigate(['/point-register']);
      this.reproducirCorrecto();
    } else {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        subHeader: 'Por favor, completa los siguientes datos:',
        message: this.generarMensajeError(),
        buttons: ['OK'],
      });
      await alert.present();
      this.reproducirError();
    }
  }

  //Validadoreees de formularioooo
  generarMensajeError(): string {
    const mensajes: string[] = [];

    if (this.registerForm.get('nombre')?.invalid) {
      mensajes.push('* Nombre.');
    }
    if (this.registerForm.get('apellido')?.invalid) {
      mensajes.push('* Apellido.');
    }
    if (this.registerForm.get('carrera')?.invalid) {
      mensajes.push('* Carrera.');
    }
    if (this.registerForm.get('sede')?.invalid) {
      mensajes.push('* Sede.');
    }
    if (this.registerForm.get('lugar')?.invalid) {
      mensajes.push('* Lugar.');
    }
    if (this.registerForm.get('correo')?.invalid) {
      if (this.registerForm.get('correo')?.errors?.['required']) {
        mensajes.push('* Correo.');
      } else if (this.registerForm.get('correo')?.errors?.['email']) {
        mensajes.push('* Correo no es válido.');
      }
    }
    if (this.registerForm.get('contraseña')?.invalid) {
      if (this.registerForm.get('contraseña')?.errors?.['required']) {
        mensajes.push('* Contraseña.');
      } else if (this.registerForm.get('contraseña')?.errors?.['minlength']) {
        mensajes.push('* Contraseña debe tener al menos 6 caracteres.');
      }
    }

    return mensajes.length > 0 ? mensajes.join(' ') : 'Todos los campos son requeridos.';
  }

  //Sonidos de 'correcto' y 'error' a la hora de registrar!!!
  reproducirCorrecto() {
    const audio = new Audio('assets/music/correcto.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
  reproducirError() {
    const audio = new Audio('assets/music/error.mp3');
    //El validador en caso de
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

  //Boton comun para volver
  async volver(){
    this.navController.pop()
  }



}
