export interface agesI {
  ageIntervalId: number;
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
export interface responseAgeI {
  status: number;
  data: agesI;
}
export interface responseChampionshipAgesI {
  status: number;
  divisionName: string;
}
