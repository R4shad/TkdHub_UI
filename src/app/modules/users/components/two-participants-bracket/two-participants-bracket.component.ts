import { Component, OnInit, Input } from '@angular/core';
import { joinNames } from './../../utils/joinCompetitorNames.utils';
import {
  bracketI,
  bracketWithCompetitorsI,
} from 'src/app/shared/models/bracket';
import {
  emptyMatch,
  emptyParticipant,
  matchI,
  matchModalI,
  matchToCreateI,
  matchWithCompetitorsI,
  responseMatchI,
} from 'src/app/shared/models/match';
import { ApiService } from '../../../../core/services/api.service';
import { Observable } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-two-participants-bracket',
  templateUrl: './two-participants-bracket.component.html',
  styleUrls: ['./two-participants-bracket.component.scss'],
})
export class TwoParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  final$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();

  winner$: Observable<matchWithCompetitorsI> =
    new Observable<matchWithCompetitorsI>();
  selecedMatch!: matchModalI;

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

  showScore(match: matchWithCompetitorsI) {
    if (match.redCompetitorId === null || match.blueCompetitorId === null) {
      return false;
    }
    return true;
  }
}
