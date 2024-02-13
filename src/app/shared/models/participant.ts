export interface participantI {
  participantCi: number;
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}
export interface responseParticipantI {
  status: number;
  data: participantI[];
}
