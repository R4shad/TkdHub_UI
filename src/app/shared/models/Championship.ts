import { ChampionshipStage } from './enums';

export interface ChampionshipI {
  championshipId: number;
  championshipName: string;
  stage: ChampionshipStage;
  championshipDate: string;
}

export interface ChampionshipToPostI {
  championshipName: string;
  organizer: string;
  organizerCi: number;
  organizerPassword: string;
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
