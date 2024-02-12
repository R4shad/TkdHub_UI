export interface coachI {
  coachCi: number;
  name: string;
  clubCode: string;
}
export interface responseCoachI {
  status: number;
  data: coachI[];
}
export interface responseCoach2I {
  status: number;
  data: {
    coachCi: number;
    clubCode: string;
  };
}
