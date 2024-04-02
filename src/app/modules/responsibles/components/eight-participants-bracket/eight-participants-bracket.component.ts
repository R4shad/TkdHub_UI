import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';
import {
  emptyMatch,
  emptyParticipant,
  matchEmptyToCreateI,
  matchModalI,
  matchToCreateI,
  matchWithCompetitorsI,
  responseMatchI,
} from 'src/app/shared/models/match';
import { joinNames } from '../../utils/joinCompetitorNames.utils';
import { shuffleArray } from '../../utils/shuffleParticipants.utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-eight-participants-bracket',
  templateUrl: './eight-participants-bracket.component.html',
  styleUrls: ['./eight-participants-bracket.component.scss'],
})
export class EightParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  quarters1$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  quarters2$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  quarters3$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  quarters4$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();

  semiFinal1$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  semiFinal2$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  final$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();

  winner$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  selecedMatch!: matchModalI;
  modalRef?: NgbModalRef;
  showModal: boolean = false;
  ngOnInit(): void {
    this.getMatches();
  }
  constructor(private api: ApiService) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        for (const match of this.matchesWithCompetitors) {
          if (match.redCompetitorId === null) {
            match.redCompetitor = emptyParticipant;
            match.redCompetitor.competitorId = '';
          } else {
            const redFullName = joinNames(
              match.redCompetitor.participant.firstNames,
              match.redCompetitor.participant.lastNames
            );
            match.redCompetitor.participant.fullName = redFullName;
          }
          if (match.blueCompetitorId === null) {
            match.blueCompetitor = emptyParticipant;
            match.blueCompetitor.competitorId = '';
          } else {
            const blueFullName = joinNames(
              match.blueCompetitor.participant.firstNames,
              match.blueCompetitor.participant.lastNames
            );
            match.blueCompetitor.participant.fullName = blueFullName;
          }
        }

        this.filterCompetitors();
      });
  }

  filterCompetitors() {
    this.quarters1$ = this.getMatchObservable('quarters1');
    this.quarters2$ = this.getMatchObservable('quarters2');
    this.quarters3$ = this.getMatchObservable('quarters3');
    this.quarters4$ = this.getMatchObservable('quarters4');
    this.semiFinal1$ = this.getMatchObservable('semifinal1');
    this.semiFinal2$ = this.getMatchObservable('semifinal2');
    this.final$ = this.getMatchObservable('final');
    this.winner$ = this.getMatchObservable('winner');
  }

  private getMatchObservable(round: string): Observable<matchWithCompetitorsI> {
    return new Observable<matchWithCompetitorsI>((observer) => {
      const match = this.matchesWithCompetitors.find((m) => m.round === round);
      observer.next(match ? match : emptyMatch);
      observer.complete();
    });
  }

  onModalClose($event: boolean) {
    this.showModal = false;
    if ($event) {
      this.getMatches();
    }
  }

  openModal(match: matchWithCompetitorsI) {
    this.selecedMatch = {
      matchId: match.matchId,
      bracketId: match.bracketId,
      blueCompetitorName: match.blueCompetitor.participant.fullName,
      redCompetitorName: match.redCompetitor.participant.fullName,

      blueCompetitorId: match.blueCompetitor.competitorId,
      redCompetitorId: match.redCompetitor.competitorId,

      round: match.round,
    };
    this.showModal = true;
  }

  matchToDefine(match: matchWithCompetitorsI) {
    if (match.redRounds != 0 || match.blueRounds != 0) {
      return false;
    }
    if (match.redCompetitorId === null || match.blueCompetitorId === null) {
      return false;
    }
    return true;
  }

  showScore(match: matchWithCompetitorsI) {
    if (match.redCompetitorId === null || match.blueCompetitorId === null) {
      return false;
    }
    if (match.redCompetitorId === match.blueCompetitorId) {
      return false;
    }
    if (match.redRounds === 0 && match.blueRounds === 0) {
      return false;
    }
    return true;
  }
}
