import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrganizerI } from 'src/app/shared/models/Organizer';
import {
  ChampionshipI,
  ChampionshipToPostI,
  responseChampionshipI,
  responseChampionshipsI,
} from 'src/app/shared/models/Championship';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { tokenI } from 'src/app/shared/models/token';
import {
  clubI,
  clubNameI,
  responseClubI,
  responseClubsI,
} from 'src/app/shared/models/Club';

import {
  agesI,
  responseAgesI,
  responseChampionshipAgesI,
  championshipAgesI,
  responseAgeI,
  ageToEditI,
} from 'src/app/shared/models/ages';
import {
  championshipDivisionI,
  divisionI,
  divisionToEditI,
  responseChampionshipDivisionI,
  responseDivisionI,
  responseDivisionsI,
} from 'src/app/shared/models/division';
import {
  categoryI,
  categoryToEditI,
  championshipCategoryI,
  responseCategoryI,
  responseChampionshipCategoryI,
} from 'src/app/shared/models/category';
import {
  participantI,
  participantToCreateI,
  participantToEditI,
  participantToValidateI,
  responseParticipantI,
  responseParticipantToCreateI,
  responseParticipantToEditI,
  responseParticipantToValidateI,
  responseParticipantsI,
} from 'src/app/shared/models/participant';
import {
  competitorI,
  completeCompetitorI,
  responseCompetitorI,
  responseCompleteCompetitorI,
} from 'src/app/shared/models/competitor';
import { responseI } from 'src/app/shared/models/response';
import {
  bracketI,
  bracketWithCompetitorsI,
  bracketWithMatchesI,
  responseBracketI,
  responseBracketWithCompetitorI,
  responseBracketWithCompetitorsI,
  responseBracketWithMatchesI,
  responseBracketsI,
} from 'src/app/shared/models/bracket';
import {
  matchEmptyToCreateI,
  matchI,
  matchIdResponseI,
  matchToCreateI,
  matchToEditI,
  matchWithCompetitorsI,
  responseMatchI,
  responseMatchesI,
  responseMatchesWithCompetitorsI,
} from 'src/app/shared/models/match';
import { ChampionshipStage } from 'src/app/shared/models/enums';

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
    organizerCi: number,
    organizerPassword: string
  ): Observable<tokenI> {
    let direccion = this.APIurl + 'championship/login/' + championshipId;

    const body = {
      organizerCi: organizerCi,
      organizerPassword: organizerPassword,
    };

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
    championshipId: number,
    nuevoClub: clubI
  ): Observable<responseClubI> {
    let direccion = this.APIurl + 'club/' + championshipId;
    return this.http.post<responseClubI>(direccion, nuevoClub);
  }
  /*
  getAges(): Observable<agesI[]> {
    let direccion = this.APIurl + 'ageInterval';
    return this.http.get<responseAgesI>(direccion).pipe(
      map((response: responseAgesI) => {
        return response.data;
      })
    );
  }*/

  getDivisionsByAge(ageIntervalId: number): Observable<divisionI[]> {
    let direccion = this.APIurl + 'division/ages/' + ageIntervalId;
    return this.http.get<responseDivisionsI>(direccion).pipe(
      map((response: responseDivisionsI) => {
        return response.data;
      })
    );
  }

  postChampionshipDivision(
    championshipId: number
  ): Observable<responseChampionshipDivisionI> {
    let direccion = this.APIurl + 'division/' + championshipId;
    return this.http.post<responseChampionshipDivisionI>(direccion, {});
  }

  postChampionshipCategory(
    championshipId: number
  ): Observable<responseChampionshipDivisionI> {
    let direccion = this.APIurl + 'category/' + championshipId;
    return this.http.post<responseChampionshipDivisionI>(direccion, {});
  }

  getChampionshipAges(championshipId: number): Observable<agesI[]> {
    let direccion = this.APIurl + 'ageInterval/' + championshipId;
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

  getChampionshipStage(championshipId: number): Observable<ChampionshipStage> {
    let direccion = this.APIurl + 'championship/stage/' + championshipId;
    return this.http.get<ChampionshipStage>(direccion).pipe(
      map((response: any) => {
        return response.data.stage;
      })
    );
  }

  updateChampionshipStage(championshipId: number): Observable<number> {
    let direccion = this.APIurl + 'championship/updateStage/' + championshipId;
    return this.http.put<responseI>(direccion, {}).pipe(
      map((response: any) => {
        return response.status;
      })
    );
  }

  getChampionshipCategory(championshipId: number): Observable<categoryI[]> {
    let direccion = this.APIurl + 'category/' + championshipId;
    return this.http.get<responseCategoryI>(direccion).pipe(
      map((response: responseCategoryI) => {
        return response.data;
      })
    );
  }

  postParticipant(
    participant: participantToCreateI,
    championshipId: number
  ): Observable<responseParticipantI> {
    let direccion = this.APIurl + 'participant/' + championshipId;
    return this.http.post<responseParticipantI>(direccion, participant);
  }

  deleteParticipant(
    championshipId: number,
    participantId: number
  ): Observable<responseParticipantI> {
    let direccion =
      this.APIurl + 'participant/' + championshipId + '/' + participantId;
    return this.http.delete<responseParticipantI>(direccion);
  }

  deleteMayorWeight(
    championshipId: number,
    grouping: string
  ): Observable<responseI> {
    let direccion = this.APIurl + 'division/' + championshipId + '/' + grouping;
    return this.http.delete<responseI>(direccion);
  }

  deleteClub(
    championshipId: number,
    clubCode: string
  ): Observable<responseClubI> {
    let direccion = this.APIurl + 'club/' + championshipId + '/' + clubCode;
    return this.http.delete<responseClubI>(direccion);
  }

  deleteAgeInterval(ageIntervalId: number): Observable<responseAgeI> {
    let direccion = this.APIurl + 'ageInterval/' + ageIntervalId;
    return this.http.delete<responseAgeI>(direccion);
  }

  deleteAllAgeInterval(championshipId: number): Observable<responseAgesI> {
    let direccion = this.APIurl + 'ageInterval/deleteAll/' + championshipId;
    return this.http.delete<responseAgesI>(direccion);
  }

  deleteCategory(categoryId: number): Observable<responseAgeI> {
    let direccion = this.APIurl + 'category/' + categoryId;
    return this.http.delete<responseAgeI>(direccion);
  }

  deleteAllCategories(championshipId: number): Observable<responseAgesI> {
    let direccion = this.APIurl + 'category/deleteAll/' + championshipId;
    return this.http.delete<responseAgesI>(direccion);
  }

  deleteDivision(divisionId: number): Observable<responseDivisionI> {
    let direccion = this.APIurl + 'division/' + divisionId;
    return this.http.delete<responseDivisionI>(direccion);
  }

  editParticipant(
    championshipId: number,
    participantId: number,
    participant: participantToEditI
  ): Observable<responseParticipantToEditI> {
    let direccion =
      this.APIurl + 'participant/' + championshipId + '/' + participantId;
    return this.http.patch<responseParticipantToEditI>(direccion, participant);
  }

  editAge(
    championshipId: number,
    ageIntervalId: number,
    age: ageToEditI
  ): Observable<responseAgeI> {
    let direccion =
      this.APIurl + 'ageInterval/' + championshipId + '/' + ageIntervalId;
    return this.http.patch<responseAgeI>(direccion, age);
  }

  editDivision(
    championshipId: number,
    divisionId: number,
    division: divisionToEditI
  ): Observable<responseDivisionI> {
    let direccion =
      this.APIurl + 'division/' + championshipId + '/' + divisionId;
    return this.http.patch<responseDivisionI>(direccion, division);
  }

  editCategory(
    championshipId: number,
    categoryId: number,
    category: categoryToEditI
  ): Observable<responseCategoryI> {
    let direccion =
      this.APIurl + 'category/' + championshipId + '/' + categoryId;
    return this.http.patch<responseCategoryI>(direccion, category);
  }

  editClub(
    championshipId: number,
    clubCode: string,
    club: clubNameI
  ): Observable<responseClubI> {
    let direccion = this.APIurl + 'club/' + championshipId + '/' + clubCode;
    return this.http.patch<responseClubI>(direccion, club);
  }

  postCompetitor(
    competitor: competitorI,
    championshipId: number
  ): Observable<responseCompetitorI> {
    let direccion = this.APIurl + 'competitor/' + championshipId;
    return this.http.post<responseCompetitorI>(direccion, competitor);
  }

  postCompetitorAndIncrementCategoryAndDivision(
    competitor: competitorI,
    championshipId: number
  ): Observable<number> {
    return new Observable<number>((observer) => {
      this.postCompetitor(competitor, championshipId).subscribe(
        (response: responseCompetitorI) => {
          if (response.status === 201) {
            this.incrementCategoryAndDivision(
              championshipId,
              competitor.divisionId,
              competitor.categoryId
            ).subscribe(() => {
              observer.next(201);
              observer.complete();
            });
          } else {
            observer.next(404);
            observer.complete();
          }
        }
      );
    });
  }

  incrementCategoryAndDivision(
    championshipId: number,
    divisionId: number,
    categoryId: number
  ): Observable<responseI[]> {
    let direccionDivision =
      this.APIurl + 'division/increment/' + championshipId + '/' + divisionId;
    let direccionCategory =
      this.APIurl + 'category/increment/' + championshipId + '/' + categoryId;
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
    return this.http.get<responseParticipantsI>(direccion).pipe(
      map((response: responseParticipantsI) => {
        return response.data;
      })
    );
  }

  getParticipants(ChampionshipId: number): Observable<participantI[]> {
    let direccion = this.APIurl + 'participant/' + ChampionshipId;
    return this.http.get<responseParticipantsI>(direccion).pipe(
      map((response: responseParticipantsI) => {
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
    return this.http.get<responseClubsI>(direccion).pipe(
      map((response: responseClubsI) => {
        return response.data;
      })
    );
  }

  verifyParticipant(
    ChampionshipId: number,
    participantId: number
  ): Observable<responseI> {
    let direccion =
      this.APIurl +
      'participant/validate/' +
      ChampionshipId +
      '/' +
      participantId;
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

  getAgeIntervalByAge(championshipId: number, age: number): Observable<agesI> {
    let direccion = this.APIurl + 'ageInterval/' + championshipId + '/' + age;
    return this.http.get<responseAgeI>(direccion).pipe(
      map((response: responseAgeI) => {
        return response.data;
      })
    );
  }

  getDivisionByData(
    championshipId: number,
    gender: string,
    ageId: number,
    weight: number
  ): Observable<divisionI> {
    let direccion =
      this.APIurl +
      'division/weight/' +
      championshipId +
      '/' +
      gender +
      '/' +
      ageId +
      '/' +
      weight;
    return this.http.get<responseDivisionI>(direccion).pipe(
      map((response: responseDivisionI) => {
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
    return this.http.get<responseDivisionsI>(direccion).pipe(
      map((response: responseDivisionsI) => {
        return response.data;
      })
    );
  }

  getDivisionData(divisionId: number): Observable<divisionI> {
    let direccion = this.APIurl + 'division/data/' + divisionId;
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
      this.APIurl + 'category/' + championshipId + '/withCompetitors';
    return this.http.get<responseCategoryI>(direccion).pipe(
      map((response: responseCategoryI) => {
        return response.data;
      })
    );
  }

  getDivisionsWithCompetitors(championshipId: number): Observable<divisionI[]> {
    let direccion =
      this.APIurl + 'division/' + championshipId + '/withCompetitors';
    return this.http.get<responseDivisionsI>(direccion).pipe(
      map((response: responseDivisionsI) => {
        return response.data;
      })
    );
  }

  postBracket(bracket: bracketI): Observable<responseBracketWithCompetitorI> {
    let direccion = this.APIurl + 'bracket/';
    return this.http.post<responseBracketWithCompetitorI>(direccion, bracket);
  }

  getBrackets(championshipId: number): Observable<bracketI[]> {
    let direccion = this.APIurl + 'bracket/' + championshipId;
    return this.http.get<responseBracketsI>(direccion).pipe(
      map((response: responseBracketsI) => {
        return response.data;
      })
    );
  }

  getBracketsWithCompetitors(
    championshipId: number
  ): Observable<bracketWithCompetitorsI[]> {
    let direccion = this.APIurl + 'bracket/withCompetitors/' + championshipId;
    return this.http.get<responseBracketWithCompetitorsI>(direccion).pipe(
      map((response: responseBracketWithCompetitorsI) => {
        return response.data;
      })
    );
  }

  getBracketsWithMatches(
    championshipId: number
  ): Observable<bracketWithMatchesI[]> {
    let direccion = this.APIurl + 'bracket/withMatchs/' + championshipId;
    return this.http.get<responseBracketWithMatchesI>(direccion).pipe(
      map((response: responseBracketWithMatchesI) => {
        return response.data;
      })
    );
  }

  postMatch(
    match: MatchToCreate,
    championshipId: number
  ): Observable<responseMatchI> {
    let direccion = this.APIurl + 'match/' + championshipId;
    return this.http.post<responseMatchI>(direccion, match);
  }

  getMatches(
    championshipId: number,
    bracketId: number
  ): Observable<matchWithCompetitorsI[]> {
    const direccion = `${this.APIurl}match/${championshipId}/${bracketId}`;
    return this.http
      .get<responseMatchesWithCompetitorsI>(direccion)
      .pipe(map((response) => response.data));
  }

  getMatchId(bracketId: number, round: string): Observable<number> {
    const direccion = `${this.APIurl}match/getId/${bracketId}/${round}`;
    return this.http
      .get<matchIdResponseI>(direccion)
      .pipe(map((response) => response.data));
  }

  editMatch(matchId: number, matchEdited: any): Observable<responseMatchI> {
    let direccion = this.APIurl + 'match/' + matchId;
    return this.http.patch<responseMatchI>(direccion, matchEdited);
  }

  createChampionship(
    newChampionship: ChampionshipToPostI
  ): Observable<responseChampionshipI> {
    let direccion = this.APIurl + 'championship';
    return this.http.post<responseChampionshipI>(direccion, newChampionship);
  }
}

type MatchToCreate = matchToCreateI | matchEmptyToCreateI;
