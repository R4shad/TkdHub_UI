export interface coachI {
  coachCi: number;
  name: string;
  clubCode: string;
}
export interface responseCoachI {
  status: number;
  data: coachI[];
}
