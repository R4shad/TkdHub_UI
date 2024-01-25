import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrganizerI } from 'src/app/shared/models/Organizer';
import {
  ChampionshipI,
  responseChampionshipI,
  responseChampionshipsI,
} from 'src/app/shared/models/Championship';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tokenI } from 'src/app/shared/models/token';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private APIurl: string;
  constructor(private http: HttpClient) {
    this.APIurl = environment.endpoint;
  }

  organizerSingIn(organizer: OrganizerI): Observable<any> {
    return this.http.post(`${this.APIurl}`, organizer);
  }

  getAllChampionships(): Observable<ChampionshipI[]> {
    let direccion = this.APIurl + 'championship';
    return this.http.get<responseChampionshipsI>(direccion).pipe(
      map((response: responseChampionshipsI) => {
        return response.data;
      })
    );
  }

  getChampionshipInfo(championshipId: number): Observable<ChampionshipI> {
    let direccion = this.APIurl + 'championship/' + championshipId;
    return this.http.get<responseChampionshipI>(direccion).pipe(
      map((response: responseChampionshipI) => {
        return response.data;
      })
    );
  }

  getOrganizerToken(
    championshipId: number,
    username: string,
    password: string
  ): Observable<tokenI> {
    let direccion = this.APIurl + 'championship/login/' + championshipId;

    const body = { organizer: username, password: password };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<tokenI>(direccion, body, httpOptions);
  }
}
