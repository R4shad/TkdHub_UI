export interface responsibleI {
  responsibleId: string;
  name: string;
  email: string;
}
export interface responsibleRI {
  id: string;
  name: string;
  email: string;
}
export interface responsibleEditI {
  id: string;
  name: string;
  email: string;
}
export interface responsiblePI {
  name: string;
  email: string;
  password: string;
}
export interface responseResponsibleI {
  status: number;
  data: responsibleI;
}

export interface responseResponsiblesI {
  status: number;
  data: responsibleI[];
}

export interface responseResponsiblesRI {
  status: number;
  data: responsibleRI;
}

export interface responseResponsiblePI {
  status: number;
  data: responsiblePI;
}
