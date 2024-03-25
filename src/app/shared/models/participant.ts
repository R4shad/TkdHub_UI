export interface participantI {
  id: string;
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}

export interface participantToCreateI {
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}

export interface participantToEditI {
  lastNames: string;
  firstNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}

export interface participantToValidateI {
  id: string;
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
  data: participantI;
}

export interface responseParticipantsI {
  status: number;
  data: participantI[];
}

export interface responseParticipantToEditI {
  status: number;
  data: participantToEditI[];
}

export interface responseParticipantToCreateI {
  status: number;
  data: participantToCreateI[];
}

export interface responseParticipantToValidateI {
  status: number;
  data: participantToValidateI[];
}
