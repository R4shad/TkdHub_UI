export interface competitorI {
  participantId: number;
  championshipId: number;
  divisionId: number;
  categoryId: number;
}

export interface completeCompetitorI {
  participantId: string;
  competitorId: string;
  divisionId: number;
  categoryId: number;
  participant: participantCompetitorI;
}

export interface participantCompetitorI {
  id: number;
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}

export interface completeCompetitorToEditI {
  participantId: string;
  competitorId: string;
  divisionId: number;
  categoryId: number;
  participant: participantCompetitorToEditI;
}

export interface participantCompetitorToEditI {
  id: number;
  isEdit: boolean;
  clubCode: string;
  firstNames: string;
  lastNames: string;
  age: number;
  weight: number;
  grade: string;
  gender: string;
}

export interface responseCompetitorI {
  status: number;
  data: competitorI[];
}

export interface responseCompleteCompetitorI {
  status: number;
  data: completeCompetitorI[];
}
