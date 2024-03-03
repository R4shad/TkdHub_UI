export interface ChampionshipI {
  championshipId: number;
  championshipName: string;
  organizer: string;
  active: boolean;
  championshipDate: string;
}
export interface responseChampionshipsI {
  status: number;
  data: ChampionshipI[];
}

export interface responseChampionshipI {
  status: number;
  data: ChampionshipI;
}
