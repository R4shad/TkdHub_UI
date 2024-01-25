export interface ChampionshipI {
  championshipId: number;
  name: string;
  organizer: string;
  password: string | null;
  active: boolean;
  championshipDate: string; // Puedes cambiar este tipo según el formato real de fecha que recibas
  createdAt: string; // Puedes cambiar este tipo según el formato real de fecha que recibas
  updatedAt: string; // Puedes cambiar este tipo según el formato real de fecha que recibas
}
export interface responseChampionshipI {
  status: number;
  data: ChampionshipI[];
}
