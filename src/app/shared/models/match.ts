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

export interface matchModalI {
  bracketId: number;
  matchId: number;

  blueCompetitorName: string;
  redCompetitorName: string;

  blueCompetitorId: string;
  redCompetitorId: string;

  round: string;
}

export interface matchWinnerI {
  blueRounds: number;
  redRounds: number;
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
  matchNumber: number;
  redCompetitor: {
    competitorId: string;
    participant: {
      lastNames: string;
      firstNames: string;
      clubCode: string;
      fullName: string;
    };
  };
  blueCompetitor: {
    competitorId: string;
    participant: {
      lastNames: string;
      firstNames: string;
      clubCode: string;
      fullName: string;
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

export interface matchIdResponseI {
  status: number;
  data: number;
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
  matchNumber: 0,
  redCompetitor: {
    competitorId: '',
    participant: {
      lastNames: '',
      firstNames: '',
      clubCode: '',
      fullName: '',
    },
  },
  blueCompetitor: {
    competitorId: '',
    participant: {
      lastNames: '',
      firstNames: '',
      clubCode: '',
      fullName: '',
    },
  },
};

export const emptyParticipant = {
  competitorId: '',
  participant: {
    lastNames: '',
    firstNames: '',
    clubCode: '',
    fullName: '',
  },
};
