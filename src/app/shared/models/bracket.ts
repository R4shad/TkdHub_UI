import { completeCompetitorI } from './competitor';

export interface bracketI {
  divisionName: string;
  categoryName: string;
  championshipId: number;
}

export interface responseBracketI {
  status: number;
  data: bracketI;
}

export interface responseBracketsI {
  status: number;
  data: bracketI[];
}

export interface bracketWithCompetitorsI {
  divisionName: string;
  categoryName: string;
  championshipId: number;
  competitors: completeCompetitorI[];
}

export interface responseBracketWithCompetitorsI {
  status: number;
  data: bracketWithCompetitorsI[];
}

export interface responseBracketWithCompetitorI {
  status: number;
  data: bracketWithCompetitorsI;
}
