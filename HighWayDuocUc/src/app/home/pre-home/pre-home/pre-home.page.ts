import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../audio.service';

@Component({
  selector: 'app-pre-home',
  templateUrl: './pre-home.page.html',
  styleUrls: ['./pre-home.page.scss'],
})
export class PreHomePage implements OnInit {

  constructor(private router: Router, private audioService: AudioService) { }

  ngOnInit() {
  }
  startJourney() {
    // Reproduce la música usando AudioService
    this.audioService.playMusic();

    // Navega a la página 'home'
    this.router.navigate(['/home']);
  }
}
