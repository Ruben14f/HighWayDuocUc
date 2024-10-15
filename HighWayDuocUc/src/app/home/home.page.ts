import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('logo', { read: ElementRef }) logo!: ElementRef<HTMLIonImgElement>;

  constructor(private animationCtrl: AnimationController, private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const animation = this.animationCtrl
        .create()
        .addElement(this.logo.nativeElement)
        .duration(2500)
        .fromTo('transform', 'translateY(0px) scale(1)', 'translateY(180px) scale(1.5)')
        .fromTo('transform-origin', 'center', 'center');

      animation.play();
    }, 0);  // Esto asegura que la animación empieza justo después de que se carga la vista
  }
  //Rutita para irse al login post click de la imagen
  palLogin() {
    this.router.navigate(['/login']);
  }
}
