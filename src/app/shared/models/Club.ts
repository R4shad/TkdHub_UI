import { coachI } from './Coach';

export interface clubI {
  name: string;
  clubCode: string;
}
export interface clubNameI {
  name: string;
}
export interface clubWithCoachI {
  name: string;
  clubCode: string;
  coach: coachI;
}
export interface responseClubsI {
  status: number;
  data: clubI[];
}

export interface responseClubI {
  status: number;
  data: clubI;
}

export interface responseClubWithCoachI {
  status: number;
  data: clubWithCoachI;
}
