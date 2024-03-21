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
  finalMatch: matchWithCompetitorsI = emptyMatch;
  editingBracket: string = '';
  selectedCompetitorId: string | null = null;
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

        this.finalMatch = this.matchesWithCompetitors.find(
          (match) => match.round === 'final'
        )!;
      });
  }

  createMatches() {
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

    const winner: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'winner',
    };
    this.api
      .postMatch(winner, this.bracket.championshipId)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
      });
  }

  editCompetitor(competitorId: string) {
    this.editingBracket = competitorId;
  }

  cancelEdit() {
    this.editingBracket = '';
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
        this.editingBracket = '';
      });
  }
}
