import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../register/info-sedes/data.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  navController = inject(NavController);
  usuario : any;
  sedeNombre: string = '';
  constructor(private router: Router, private dataService: DataService, ) { }

  ngOnInit() {
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    this.usuario = usuarioRegistrado? JSON.parse(usuarioRegistrado) : null;


    if (this.usuario && this.usuario.sede) {
      this.dataService.getSedes().subscribe(sedes => {
        const sedeEncontrada = sedes.find(sede => sede.id === this.usuario.sede);
        if (sedeEncontrada) {
          this.sedeNombre = sedeEncontrada.nombre.replace('Sede ', '');
        }
      });
    }
  }

  logout(){
    localStorage.removeItem('usuarioRegistrado');
    this.router.navigate(['/login']);
  }

  async volver(){
    this.navController.pop()
  }

}
