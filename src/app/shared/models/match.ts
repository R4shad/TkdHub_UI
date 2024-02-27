export interface matchI {
  matchId: string;
  bracketId: number;
  blueParticipantId: string;
  redParticipantId: string;
  round: string;
  blueRounds: number;
  redRounds: number;
  championshipId: number;
}

export interface matchWithCompetitorsI {
  matchId: string;
  bracketId: number;
  blueParticipantId: string;
  redParticipantId: string;
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
  blueParticipantId: string;
  redParticipantId: string;
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
