import { Component, inject} from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-travel-history',
  templateUrl: './travel-history.page.html',
  styleUrls: ['./travel-history.page.scss'],
})
export class TravelHistoryPage{

  navController = inject(NavController);

  constructor() { }

  async volver(){
    this.navController.pop();
  }
}
