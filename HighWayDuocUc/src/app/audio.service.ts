import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();

  constructor() {
    this.audio.src = 'assets/music/Life is a highway.mp3'; // Ruta a tu archivo de música
    this.audio.loop = true; // Para que la música se repita
  }
  playMusic() {
    this.audio.volume = 0.3;
    this.audio.play();
  }

}
