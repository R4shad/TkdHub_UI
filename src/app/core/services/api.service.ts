import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrganizerI } from 'src/app/shared/models/Organizer';
import {
  ChampionshipI,
  responseChampionshipI,
  responseChampionshipsI,
} from 'src/app/shared/models/Championship';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { tokenI } from 'src/app/shared/models/token';
import { clubI, responseClubI } from 'src/app/shared/models/Club';
import {
  coachI,
  responseCoachI,
  responseCoach2I,
} from 'src/app/shared/models/Coach';
import {
  agesI,
  responseAgesI,
  responseChampionshipAgesI,
  championshipAgesI,
  responseAgeI,
} from 'src/app/shared/models/ages';
import {
  championshipDivisionI,
  divisionI,
  responseChampionshipDivisionI,
  responseDivisionI,
} from 'src/app/shared/models/division';
import {
  categoryI,
  championshipCategoryI,
  responseCategoryI,
  responseChampionshipCategoryI,
} from 'src/app/shared/models/category';
import {
  participantI,
  participantToValidateI,
  responseParticipantI,
  responseParticipantToValidateI,
} from 'src/app/shared/models/participant';
import {
  competitorI,
  completeCompetitorI,
  responseCompetitorI,
  responseCompleteCompetitorI,
} from 'src/app/shared/models/competitor';
import { responseI } from 'src/app/shared/models/response';
import { bracketI, responseBracketI } from 'src/app/shared/models/bracket';

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

  getClubCode(coachCi: number): Observable<string> {
    let direccion = `${this.APIurl}coach/getClubCode/${coachCi}`;
    return this.http
      .get<responseCoach2I>(direccion)
      .pipe(map((response: responseCoach2I) => response.data.clubCode));
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

  getTrainerToken(
    championshipId: number,
    coachCi: number,
    password: string
  ): Observable<tokenI> {
    let direccion = this.APIurl + 'coach/login/' + championshipId;

    const body = { coachCi: coachCi, password: password };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<tokenI>(direccion, body, httpOptions);
  }

  getResponsibleToken(
    championshipId: number,
    responsibleCi: string,
    password: string
  ): Observable<tokenI> {
    let direccion = this.APIurl + 'responsible/login/' + championshipId;

    const body = { responsibleCi: responsibleCi, password: password };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<tokenI>(direccion, body, httpOptions);
  }

  postClub(
    nuevoClub: clubI,
    championshipId: number
  ): Observable<responseClubI> {
    let direccion = this.APIurl + 'club/' + championshipId;
    let clubInfo = {
      clubCode: nuevoClub.clubCode,
      name: nuevoClub.name,
    };
    return this.http.post<responseClubI>(direccion, clubInfo);
  }

  postCoach(
    nuevoClub: clubI,
    championshipId: number
  ): Observable<responseCoachI> {
    let direccion = this.APIurl + 'coach/' + championshipId;
    let entrenadorInfo: coachI = {
      coachCi: nuevoClub.coach.coachCi,
      name: nuevoClub.coach.name,
      clubCode: nuevoClub.coach.clubCode,
    };
    return this.http.post<responseCoachI>(direccion, entrenadorInfo);
  }

  getAges(): Observable<agesI[]> {
    let direccion = this.APIurl + 'ageInterval';
    return this.http.get<responseAgesI>(direccion).pipe(
      map((response: responseAgesI) => {
        return response.data;
      })
    );
  }

  getDivision(ageIntervalId: number): Observable<divisionI[]> {
    let direccion = this.APIurl + 'division/' + ageIntervalId;
    return this.http.get<responseDivisionI>(direccion).pipe(
      map((response: responseDivisionI) => {
        return response.data;
      })
    );
  }

  postChampionshipAgeInterval(
    ageInterval: agesI,
    championshipId: number
  ): Observable<responseChampionshipAgesI> {
    let championshipAgeInterval: championshipAgesI = {
      ageIntervalId: ageInterval.id,
    };
    let direccion = this.APIurl + 'championshipAgeInterval/' + championshipId;
    return this.http.post<responseChampionshipAgesI>(
      direccion,
      championshipAgeInterval
    );
  }
  postChampionshipDivision(
    division: divisionI,
    championshipId: number
  ): Observable<responseChampionshipDivisionI> {
    let championshipAgeInterval: championshipDivisionI = {
      divisionName: division.divisionName,
    };
    let direccion = this.APIurl + 'championshipDivision/' + championshipId;
    return this.http.post<responseChampionshipDivisionI>(
      direccion,
      championshipAgeInterval
    );
  }

  getChampionshipAges(championshipId: number): Observable<agesI[]> {
    let direccion = this.APIurl + 'championshipAgeInterval/' + championshipId;
    return this.http.get<responseAgesI>(direccion).pipe(
      map((response: responseAgesI) => {
        return response.data;
      })
    );
  }

  getCategories(): Observable<categoryI[]> {
    let direccion = this.APIurl + 'category';
    return this.http.get<responseCategoryI>(direccion).pipe(
      map((response: responseCategoryI) => {
        return response.data;
      })
    );
  }

  getChampionshipCategory(championshipId: number): Observable<categoryI[]> {
    let direccion = this.APIurl + 'championshipCategory/' + championshipId;
    return this.http.get<responseCategoryI>(direccion).pipe(
      map((response: responseCategoryI) => {
        return response.data;
      })
    );
  }

  postChampionshipCategory(
    category: categoryI,
    championshipId: number
  ): Observable<responseChampionshipCategoryI> {
    let championshipAgeInterval: championshipCategoryI = {
      categoryName: category.categoryName,
    };
    let direccion = this.APIurl + 'championshipCategory/' + championshipId;
    return this.http.post<responseChampionshipCategoryI>(
      direccion,
      championshipAgeInterval
    );
  }

  postParticipant(
    participant: participantI,
    championshipId: number
  ): Observable<responseParticipantI> {
    let direccion = this.APIurl + 'participant/' + championshipId;
    return this.http.post<responseParticipantI>(direccion, participant);
  }

  postCompetitor(
    competitor: competitorI,
    championshipId: number
  ): Observable<responseCompetitorI> {
    let direccion = this.APIurl + 'competitor/' + championshipId;
    return this.http.post<responseCompetitorI>(direccion, competitor);
  }

  incrementCategoryAndDivision(
    championshipId: number,
    divisionName: string,
    categoryName: string
  ): Observable<responseI[]> {
    let direccionDivision =
      this.APIurl +
      'championshipDivision/increment/' +
      championshipId +
      '/' +
      divisionName;
    let direccionCategory =
      this.APIurl +
      'championshipCategory/increment/' +
      championshipId +
      '/' +
      categoryName;
    let responses: responseI[] = [];

    const requestDivision = this.http.put<responseI>(direccionDivision, {});
    const requestCategory = this.http.put<responseI>(direccionCategory, {});
    return forkJoin([requestDivision, requestCategory]);
  }

  getChampionshipCompetitors(
    championshipId: number
  ): Observable<completeCompetitorI[]> {
    let direccion = this.APIurl + 'competitor/' + championshipId;
    return this.http.get<responseCompleteCompetitorI>(direccion).pipe(
      map((response: responseCompleteCompetitorI) => {
        return response.data;
      })
    );
  }

  getParticipantsClub(
    ChampionshipId: number,
    clubCode: string
  ): Observable<participantI[]> {
    let direccion =
      this.APIurl + 'participant/club/' + ChampionshipId + '/' + clubCode;
    return this.http.get<responseParticipantI>(direccion).pipe(
      map((response: responseParticipantI) => {
        return response.data;
      })
    );
  }

  getParticipants(ChampionshipId: number): Observable<participantI[]> {
    let direccion = this.APIurl + 'participant/' + ChampionshipId;
    return this.http.get<responseParticipantI>(direccion).pipe(
      map((response: responseParticipantI) => {
        return response.data;
      })
    );
  }

  getParticipantsToVerify(
    ChampionshipId: number
  ): Observable<participantToValidateI[]> {
    let direccion = this.APIurl + 'participant/' + ChampionshipId;
    return this.http.get<responseParticipantToValidateI>(direccion).pipe(
      map((response: responseParticipantToValidateI) => {
        return response.data;
      })
    );
  }

  getClubs(ChampionshipId: number): Observable<clubI[]> {
    let direccion = this.APIurl + 'club/' + ChampionshipId;
    return this.http.get<responseClubI>(direccion).pipe(
      map((response: responseClubI) => {
        return response.data;
      })
    );
  }

  verifyParticipant(
    ChampionshipId: number,
    participantCi: number
  ): Observable<responseI> {
    let direccion =
      this.APIurl + 'participant/' + ChampionshipId + '/' + participantCi;
    return this.http.patch<responseI>(direccion, {}).pipe(
      map((response: responseI) => {
        return response;
      })
    );
  }

  getChampionshipCategories(championshipId: number): Observable<categoryI[]> {
    let direccion = this.APIurl + 'category/' + championshipId;
    return this.http.get<responseCategoryI>(direccion).pipe(
      map((response: responseCategoryI) => {
        return response.data;
      })
    );
  }

  getChampionshipAgeInterval(championshipId: number): Observable<agesI[]> {
    let direccion = this.APIurl + 'ageInterval/' + championshipId;
    return this.http.get<responseAgesI>(direccion).pipe(
      map((response: responseAgesI) => {
        return response.data;
      })
    );
  }

  getChampionshipDivisions(championshipId: number): Observable<divisionI[]> {
    let direccion = this.APIurl + 'division/' + championshipId;
    return this.http.get<responseDivisionI>(direccion).pipe(
      map((response: responseDivisionI) => {
        return response.data;
      })
    );
  }

  getAgeIntervalId(age: number): Observable<agesI> {
    let direccion = this.APIurl + 'ageInterval/byAge/' + age;
    return this.http.get<responseAgeI>(direccion).pipe(
      map((response: responseAgeI) => {
        return response.data;
      })
    );
  }

  getCategoriesWithCompetitors(
    championshipId: number
  ): Observable<categoryI[]> {
    let direccion =
      this.APIurl +
      'championshipCategory/' +
      championshipId +
      '/withCompetitors';
    return this.http.get<responseCategoryI>(direccion).pipe(
      map((response: responseCategoryI) => {
        return response.data;
      })
    );
  }

  getDivisionsWithCompetitors(championshipId: number): Observable<divisionI[]> {
    let direccion =
      this.APIurl +
      'championshipDivision/' +
      championshipId +
      '/withCompetitors';
    return this.http.get<responseDivisionI>(direccion).pipe(
      map((response: responseDivisionI) => {
        return response.data;
      })
    );
  }

  postBracket(bracket: bracketI): Observable<responseBracketI> {
    let direccion = this.APIurl + 'bracket/';
    return this.http.post<responseBracketI>(direccion, bracket);
  }
}
