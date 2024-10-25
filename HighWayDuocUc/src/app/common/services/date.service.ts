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
    const obs = this.http.get('http://worldclockapi.com/api/json/utc/now');
    return lastValueFrom(obs);
  }


}
