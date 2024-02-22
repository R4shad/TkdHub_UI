export interface participantI {
  participantId: number;
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}

export interface participantToValidateI {
  participantId: number;
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

export interface responseParticipantToValidateI {
  status: number;
  data: participantToValidateI[];
}
