export interface coachI {
  coachCi: number;
  name: string;
  clubCode: string;
}

export interface coachToPostI {
  coachCi: number;
  name: string;
  clubCode: string;
  password: string;
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
