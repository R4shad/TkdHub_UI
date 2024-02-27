import { Component, OnInit, Input } from '@angular/core';
import {
  bracketI,
  bracketWithCompetitorsI,
} from 'src/app/shared/models/bracket';
import {
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

  ngOnInit(): void {
    console.log('Datos del bracket:', this.bracket);
    this.getMatches();
  }

  constructor(private api: ApiService) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        console.log(this.matchesWithCompetitors);

        if (this.matchesWithCompetitors.length === 0) {
          this.createMatch();
        }
      });
  }

  createMatch() {
    const newMatch: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueParticipantId: this.bracket.competitors[0].competitorId,
      redParticipantId: this.bracket.competitors[0].competitorId,
      round: 'final',
    };
    console.log(newMatch);
    this.api
      .postMatch(newMatch, this.bracket.championshipId)
      .subscribe((response: responseMatchI) => {
        console.log(response);
        this.getMatches();
      });
  }
}
