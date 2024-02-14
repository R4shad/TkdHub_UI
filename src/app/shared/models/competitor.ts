export interface competitorI {
  participantCi: number;
  championshipId: number;
  divisionName: string;
  categoryName: string;
}

export interface responseCompetitorI {
  status: number;
  data: competitorI[];
}
