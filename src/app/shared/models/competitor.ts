export interface competitorI {
  participantId: number;
  championshipId: number;
  divisionName: string;
  categoryName: string;
}

export interface completeCompetitorI {
  participantId: string;
  competitorId: string;
  divisionName: string;
  categoryName: string;
  Participant: {
    clubCode: string;
    firstNames: string;
    lastNames: string;
    age: number;
    weight: number;
    grade: string;
    gender: string;
  };
}

export interface responseCompetitorI {
  status: number;
  data: competitorI[];
}

export interface responseCompleteCompetitorI {
  status: number;
  data: completeCompetitorI[];
}
