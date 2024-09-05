import { Component, OnInit, inject} from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-travel',
  templateUrl: './create-travel.page.html',
  styleUrls: ['./create-travel.page.scss'],
})
export class CreateTravelPage implements OnInit {

  navController = inject(NavController);

  constructor() { }

  ngOnInit() {
  }

  async volver(){
    this.navController.pop()
  }
}
