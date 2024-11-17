import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  @ViewChild('logo', { read: ElementRef }) logo!: ElementRef<HTMLIonImgElement>;

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
  ) {}

  async ionViewDidEnter() {

    // Simular un retraso para asegurarnos de que la imagen esté cargada (opcional)
    setTimeout(async () => {
      // Configura la animación
      const animation = this.animationCtrl
        .create()
        .addElement(this.logo.nativeElement)
        .duration(2500)
        .fromTo('transform', 'translateY(0px) scale(1)', 'translateY(180px) scale(1.5)')
        .fromTo('transform-origin', 'center', 'center');

      // Inicia la animación
      animation.play();
    }, 500); // Puedes ajustar este tiempo para simular una carga
  }

  // Navegar al login
  palLogin() {
    this.router.navigate(['/login']);
  }
}
