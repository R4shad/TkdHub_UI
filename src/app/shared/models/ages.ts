export interface agesI {
  id: number;
  ageIntervalName: string;
  minAge: number;
  maxAge: number;
}

export interface championshipAgesI {
  ageIntervalId: number;
}

export interface responseAgesI {
  status: number;
  data: agesI[];
}

export interface responseChampionshipAgesI {
  championshipId: number;
  ageIntervalId: number;
}
