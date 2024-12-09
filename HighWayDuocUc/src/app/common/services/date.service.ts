import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private http: HttpClient) { }

  // Método para obtener la fecha actual desde la API sin especificar el tipo
  async getFechaActual(): Promise<any> {
    const obs = this.http.get('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
    return lastValueFrom(obs);
  }


}
