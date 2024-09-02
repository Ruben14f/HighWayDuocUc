export interface Sede {
  id: number;
  nombre: string;
}

export interface Carrera {
  id: number;
  nombre: string;
  sedeId: number[]; // Relación con la sede
}
