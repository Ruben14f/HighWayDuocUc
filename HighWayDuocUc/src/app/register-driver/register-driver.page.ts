import { Component, inject} from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register-driver',
  templateUrl: './register-driver.page.html',
  styleUrls: ['./register-driver.page.scss'],
})
export class RegisterDriverPage{

  navController = inject(NavController);

  constructor() { }

  async volver(){
    this.navController.pop();
  }

}
