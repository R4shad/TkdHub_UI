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

  loading: boolean = false;

  selecedMatch!: matchModalI;

  modalRef?: NgbModalRef;
  ngOnInit(): void {
    this.getMatches();
  }
  showModal: boolean = false;
  constructor(private api: ApiService) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        console.log(this.matchesWithCompetitors);
        for (const match of this.matchesWithCompetitors) {
          if (match.redCompetitorId === null) {
            match.redCompetitor = emptyParticipant;
            match.redCompetitor.competitorId = '';
          } else {
            const redFullName = joinNames(
              match.redCompetitor.Participant.firstNames,
              match.redCompetitor.Participant.lastNames
            );
            match.redCompetitor.Participant.fullName = redFullName;
          }
          if (match.blueCompetitorId === null) {
            match.blueCompetitor = emptyParticipant;
            match.blueCompetitor.competitorId = '';
          } else {
            const blueFullName = joinNames(
              match.blueCompetitor.Participant.firstNames,
              match.blueCompetitor.Participant.lastNames
            );
            match.blueCompetitor.Participant.fullName = blueFullName;
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

    this.semiFinal1$.subscribe({
      next: (value) => {
        console.log('Valor emitido por semiFinal1$: ', value);
      },
      error: (error) => {
        console.error('Error en semiFinal1$: ', error);
      },
      complete: () => {
        console.log('semiFinal1$ completado');
      },
    });

    this.semiFinal2$.subscribe({
      next: (value) => {
        console.log('Valor emitido por semiFinal2$: ', value);
      },
      error: (error) => {
        console.error('Error en semiFinal2$: ', error);
      },
      complete: () => {
        console.log('semiFinal2$ completado');
      },
    });
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
      console.log('CERRE MODAL');
      this.getMatches();
    }
  }

  openModal(match: matchWithCompetitorsI) {
    this.selecedMatch = {
      matchId: match.matchId,
      bracketId: match.bracketId,
      blueCompetitorName: match.blueCompetitor.Participant.fullName,
      redCompetitorName: match.redCompetitor.Participant.fullName,

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
}
