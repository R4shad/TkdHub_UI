import { completeCompetitorI } from './competitor';
import { matchI } from './match';

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
  bracketId: number;
  divisionName: string;
  categoryName: string;
  championshipId: number;
  competitors: completeCompetitorI[];
}

export interface bracketWithCompetitorsToPostI {
  divisionName: string;
  categoryName: string;
  championshipId: number;
  competitors: completeCompetitorI[];
}

export interface bracketWithMatchesI {
  divisionName: string;
  categoryName: string;
  championshipId: number;
  matchs: matchI[];
}

export interface responseBracketWithMatchesI {
  status: number;
  data: bracketWithMatchesI[];
}

export interface responseBracketWithCompetitorsI {
  status: number;
  data: bracketWithCompetitorsI[];
}

export interface responseBracketWithCompetitorI {
  status: number;
  data: bracketWithCompetitorsI;
}
