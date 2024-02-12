export interface participantI {
  participantCi: number;
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
  verified: boolean;
}
export interface responseParticipantI {
  status: number;
  data: participantI[];
}
