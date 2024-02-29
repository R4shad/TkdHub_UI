import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
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
@Component({
  selector: 'app-two-participants-bracket',
  templateUrl: './two-participants-bracket.component.html',
  styleUrls: ['./two-participants-bracket.component.scss'],
})
export class TwoParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];
  selectedCompetitorId: string | null = null;
  finalMatch: matchWithCompetitorsI = emptyMatch;
  editingBracket: boolean = false;
  ngOnInit(): void {
    this.getMatches();
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

  changeOrder() {
    this.editingBracket = !this.editingBracket;
  }
  onSelectCompetitor(event: any) {
    const competitorId = event.target?.value;
    if (competitorId !== undefined) {
      this.selectedCompetitorId = competitorId;
    }
  }

  confirmEdit(
    matchId: number,
    blueCompetitorId: string,
    redCompetitorId: string
  ) {
    const editedMatch = {
      blueCompetitorId: redCompetitorId,
      redCompetitorId: blueCompetitorId,
    };
    this.api
      .editMatch(matchId, editedMatch)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
        this.editingBracket = false;
      });
  }
}
