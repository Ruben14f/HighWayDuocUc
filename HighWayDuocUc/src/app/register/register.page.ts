import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage{

  navController = inject(NavController);

  constructor(private router: Router) { }

  paraRegistrarse() {
    this.router.navigate(['/point-register']);
  }

  async volver(){
    this.navController.pop()
  }
    
}
