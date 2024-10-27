import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private isPlaying = false; // Estado para verificar si la música está sonando

  constructor() {
    this.audio.src = 'assets/music/Life is a highway.mp3'; // Ruta a tu archivo de música
    this.audio.loop = true; // Para que la música se repita
    this.audio.volume = 0.3;
  }

  // Reproduce la música
  playMusic() {
    this.audio.play();
    this.isPlaying = true;
  }

  // Pausa la música
  pauseMusic() {
    this.audio.pause();
    this.isPlaying = false;
  }

  // Alterna entre reproducir y pausar
  toggleMusic() {
    this.isPlaying ? this.pauseMusic() : this.playMusic();
  }

  // Método para verificar si la música está sonando
  getIsPlaying() {
    return this.isPlaying;
  }
}
