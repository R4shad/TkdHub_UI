export interface clubI {
  name: string;
  clubCode: string;
  email: string;
  coachName: string;
}
export interface clubPI {
  name: string;
  clubCode: string;
  email: string;
  coachName: string;
  password: string;
}
export interface clubNameI {
  name: string;
}

export interface responseClubsI {
  status: number;
  data: clubI[];
}

export interface responseClubsPI {
  status: number;
  data: clubPI[];
}

export interface responseClubI {
  status: number;
  data: clubI;
}
