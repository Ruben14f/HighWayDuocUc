import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private isPlaying = false; // Estado para verificar si la música está sonando

  constructor() {
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
