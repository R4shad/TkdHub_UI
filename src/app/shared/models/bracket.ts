import { completeCompetitorI, completeCompetitorToEditI } from './competitor';
import { matchI } from './match';

export interface bracketI {
  divisionId: number;
  categoryId: number;
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
  divisionId: number;
  categoryId: number;
  divisionName: string;
  categoryName: string;
  championshipId: number;
  competitors: completeCompetitorI[];
}

export interface bracketWithCompetitorsEI {
  bracketId: number;
  divisionId: number;
  categoryId: number;
  championshipId: number;
  competitors: completeCompetitorToEditI[];
}

export interface bracketInfoI {
  bracketId: number;
  divisionId: number;
  categoryId: number;
  minWeight: number;
  maxWeight: number;
  categoryName: string;
  championshipId: number;
  infoToShow: string;
}

export interface bracketWithCompetitorsToPostI {
  divisionId: number;
  categoryId: number;
  championshipId: number;
  competitors: completeCompetitorI[];
}

export interface bracketWithMatchesI {
  divisionId: number;
  categoryId: number;
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

export interface responseBracketWithCompetitorsToEditI {
  status: number;
  data: bracketWithCompetitorsEI[];
}

export interface responseBracketWithCompetitorToEditI {
  status: number;
  data: bracketWithCompetitorsEI;
}
