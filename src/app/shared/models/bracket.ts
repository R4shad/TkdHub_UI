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
