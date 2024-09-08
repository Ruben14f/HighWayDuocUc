import { Component, inject, OnInit} from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-travel-history',
  templateUrl: './travel-history.page.html',
  styleUrls: ['./travel-history.page.scss'],
})
export class TravelHistoryPage implements OnInit{
  navController = inject(NavController);

  constructor() { }

  ngOnInit() {
  }

  async volver(){
    this.navController.pop();
  }

}
