export interface matchI {
  matchId: string;
  bracketId: number;
  blueParticipantId: string;
  redParticipantId: string;
  round: string;
  blueRounds: number;
  redRounds: number;
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

export interface responseMatchsI {
  status: number;
  data: matchI[];
}
