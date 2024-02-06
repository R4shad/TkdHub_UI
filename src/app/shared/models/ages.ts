export interface agesI {
  name: string;
  minAge: number;
  maxAge: number;
}
export interface responseAgesI {
  status: number;
  data: agesI[];
}
