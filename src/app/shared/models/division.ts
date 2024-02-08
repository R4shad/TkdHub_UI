export interface divisionI {
  divisionName: string;
  ageIntervalId: number;
  minWeight: number;
  maxWeight: number;
  gender: string;
  grouping: string;
}
export interface responseDivisionI {
  status: number;
  data: divisionI[];
}
