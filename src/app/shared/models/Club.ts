import { coachI } from './Coach';

export interface clubI {
  name: string;
  clubCode: string;
  coach: coachI;
}
export interface responseClubI {
  status: number;
  data: clubI[];
}
