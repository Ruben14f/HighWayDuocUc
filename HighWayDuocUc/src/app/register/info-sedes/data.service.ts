import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sede, Carrera } from '../info-sedes/sede.model';

//Acá estan todoooooos los datos de las sedes de la región Metropolitana
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sedes: Sede[] = [
    { id: 1, nombre: 'Sede Alameda' },
    { id: 2, nombre: 'Sede Antonio Varas' },
    { id: 3, nombre: 'Sede Maipú' },
    { id: 4, nombre: 'Sede Melipilla' },
    { id: 5, nombre: 'Sede Plaza Oeste' },
    { id: 6, nombre: 'Sede Plaza Norte' },
    { id: 7, nombre: 'Sede Plaza Vespucio' },
    { id: 8, nombre: 'Sede Puente Alto' },
    { id: 9, nombre: 'Sede San Bernardo' },
  ];

  private carreras: Carrera[] = [
    { id: 1, nombre: 'Ingeniería en Administración mención Finanzas', sedeId: [1,2,4,5,7,9] },
    { id: 2, nombre: 'Ingeniería en Construcción', sedeId: [1,4,8,9] },
    { id: 3, nombre: 'Ingeniería en Gestión Logistica', sedeId: [1,2,3,4,7,9] },
    { id: 4, nombre: 'Ingeniería en Informática', sedeId: [1,2,3,4,5,6,7,8,9] },
    { id: 5, nombre: 'Auditoria', sedeId: [1,2,3,5,9] },
    { id: 6, nombre: 'Técnico Topografo', sedeId: [1,3] },
    { id: 7, nombre: 'Técnico en Construcción', sedeId: [1,3,4,8] },
    { id: 8, nombre: 'Ingeniería en Administración mención gestión de personas', sedeId: [2,3,5,6,8,9] },
    { id: 9, nombre: 'Ingeniería en Comercio Exterior', sedeId: [2,6,7] },
    { id: 10, nombre: 'Ingeniería en Conectividad y Redes', sedeId: [2,6,7,8,9] },
    { id: 11, nombre: 'Ingeniería en Marketing Digital', sedeId: [2,3,5,6,7,8] },
    { id: 12, nombre: 'Administración de Redes y Telecomunicaciones', sedeId: [2,9] },
    { id: 13, nombre: 'Técnico en administración', sedeId: [2,3,4,9] },
    { id: 14, nombre: 'Ingeniería en Electricidad y Automatización Industrial', sedeId: [3,4,8,9] },
    { id: 15, nombre: 'Ingeniería en Mecánica Automotriz y Autotrónica', sedeId: [3,4,8,9] },
    { id: 16, nombre: 'Ingeniería en Maquinaria y Vehiculos Pesados', sedeId: [3,9] },
    { id: 17, nombre: 'Publicidad', sedeId: [3,6,7,8] },
    { id: 18, nombre: 'Técnico en Mantenimiento Electromecánico', sedeId: [3] },
    { id: 19, nombre: 'Técnico en Maquinaria y Vehiculos Pesados', sedeId: [3,9] },
    { id: 20, nombre: 'Técnico en Electricidad y Automatización Industrial', sedeId: [3,4,8,9] },
    { id: 21, nombre: 'Técnico en Mecánica Automotriz y Autotrónica', sedeId: [3,4,8,9] },
    { id: 22, nombre: 'Administración de Redes y Telecomunicaciones', sedeId: [5,8] },
    { id: 23, nombre: 'Técnico en gestión logística', sedeId: [5,6,7,9] },
    { id: 24, nombre: 'Desarrollo y Diseño Web', sedeId: [7] },
    { id: 25, nombre: 'Analista Programador', sedeId: [3,6,5,9] },



  ];

  constructor() { }
  //Para las opciones de registro
  getSedes(): Observable<Sede[]> {
    return of(this.sedes);
  }

  getCarreras(): Observable<Carrera[]> {
    return of(this.carreras);
  }

  //Para el 'inicio-passenger' en filtros
  getCarrerasPorSede(sedeId: number): Observable<Carrera[]> {
    const carrerasFiltradas = this.carreras.filter(carrera => carrera.sedeId.includes(sedeId));
    return of(carrerasFiltradas);
  }

}
