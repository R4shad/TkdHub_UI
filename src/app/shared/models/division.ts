export interface divisionI {
  divisionId: number;
  divisionName: string;
  ageIntervalId: number;
  minWeight: number;
  maxWeight: number;
  gender: string;
  grouping: string;
  numberOfCompetitors: number;
}

export interface championshipDivisionI {
  divisionName: string;
}

export interface responseDivisionsI {
  status: number;
  data: divisionI[];
}
export interface responseDivisionI {
  status: number;
  data: divisionI;
}
export interface responseChampionshipDivisionI {
  status: number;
  ageIntervalId: number;
}
