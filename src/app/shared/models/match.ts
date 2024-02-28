export interface matchI {
  matchId: string;
  bracketId: number;
  blueCompetitorId: string;
  redCompetitorId: string;
  round: string;
  blueRounds: number;
  redRounds: number;
  championshipId: number;
}

export interface matchToEditI {
  bracketId: number;
  blueCompetitorId: string;
  redCompetitorId: string;
  round: string;
  blueRounds: number;
  redRounds: number;
  championshipId: number;
}

export interface matchWithCompetitorsI {
  matchId: number;
  bracketId: number;
  blueCompetitorId: string;
  redCompetitorId: string;
  round: string;
  blueRounds: number;
  redRounds: number;
  championshipId: number;
  redCompetitor: {
    competitorId: string;
    Participant: {
      lastNames: string;
      firstNames: string;
      clubCode: string;
    };
  };
  blueCompetitor: {
    competitorId: string;
    Participant: {
      lastNames: string;
      firstNames: string;
      clubCode: string;
    };
  };
}

export interface matchToCreateI {
  bracketId: number;
  blueCompetitorId: string | null;
  redCompetitorId: string | null;
  round: string;
}

export interface matchEmptyToCreateI {
  bracketId: number;
  round: string;
}

export interface responseMatchI {
  status: number;
  data: matchI;
}

export interface responseMatchesI {
  status: number;
  data: matchI[];
}

export interface responseMatchesWithCompetitorsI {
  status: number;
  data: matchWithCompetitorsI[];
}

export const emptyMatch: matchWithCompetitorsI = {
  matchId: 0,
  bracketId: 0,
  blueCompetitorId: '',
  redCompetitorId: '',
  round: '',
  blueRounds: 0,
  redRounds: 0,
  championshipId: 0,
  redCompetitor: {
    competitorId: '',
    Participant: {
      lastNames: '',
      firstNames: '',
      clubCode: '',
    },
  },
  blueCompetitor: {
    competitorId: '',
    Participant: {
      lastNames: '',
      firstNames: '',
      clubCode: '',
    },
  },
};
