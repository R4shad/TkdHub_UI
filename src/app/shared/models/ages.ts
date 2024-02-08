export interface agesI {
  id: number;
  ageIntervalName: string;
  minAge: number;
  maxAge: number;
}
export interface responseAgesI {
  status: number;
  data: agesI[];
}
