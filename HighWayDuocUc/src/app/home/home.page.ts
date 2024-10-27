import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('logo', { read: ElementRef }) logo!: ElementRef<HTMLIonImgElement>;

  constructor(
    private animationCtrl: AnimationController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    // Configura la animación
    const animation = this.animationCtrl
      .create()
      .addElement(this.logo.nativeElement)
      .duration(2500)
      .fromTo('transform', 'translateY(0px) scale(1)', 'translateY(180px) scale(1.5)')
      .fromTo('transform-origin', 'center', 'center');

    animation.play();
  }

  // Navegar al login
  palLogin() {
    this.router.navigate(['/login']);
  }
}
