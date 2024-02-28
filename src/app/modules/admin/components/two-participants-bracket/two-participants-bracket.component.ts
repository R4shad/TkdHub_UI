import { Component, OnInit, Input } from '@angular/core';
import {
  bracketI,
  bracketWithCompetitorsI,
} from 'src/app/shared/models/bracket';
import {
  emptyMatch,
  matchI,
  matchToCreateI,
  matchWithCompetitorsI,
  responseMatchI,
} from 'src/app/shared/models/match';
import { ApiService } from '../../../../core/services/api.service';
import { bracketWithMatchesI } from './../../../../shared/models/bracket';
@Component({
  selector: 'app-two-participants-bracket',
  templateUrl: './two-participants-bracket.component.html',
  styleUrls: ['./two-participants-bracket.component.scss'],
})
export class TwoParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  finalMatch: matchWithCompetitorsI = emptyMatch;

  ngOnInit(): void {
    this.getMatches();
  }
  changesEditor: boolean = false;
  changeOrder() {
    this.changesEditor = !this.changesEditor;
    console.log(this.bracket);
  }
  constructor(private api: ApiService) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        this.finalMatch = this.matchesWithCompetitors.find(
          (match) => match.round === 'final'
        )!;
      });
  }

  createMatch() {
    const newMatch: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: this.bracket.competitors[0].competitorId,
      redCompetitorId: this.bracket.competitors[1].competitorId,
      round: 'final',
    };
    this.api
      .postMatch(newMatch, this.bracket.championshipId)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
      });
  }
}
