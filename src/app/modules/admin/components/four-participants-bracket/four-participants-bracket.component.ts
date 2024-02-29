import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';
import {
  emptyMatch,
  matchEmptyToCreateI,
  matchToCreateI,
  matchWithCompetitorsI,
  responseMatchI,
} from 'src/app/shared/models/match';
import { shuffleArray } from '../../utils/shuffleParticipants.utils';
import { joinNames } from '../../utils/joinCompetitorNames.utils';

@Component({
  selector: 'app-four-participants-bracket',
  templateUrl: './four-participants-bracket.component.html',
  styleUrls: ['./four-participants-bracket.component.scss'],
})
export class FourParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  semiFinal1: matchWithCompetitorsI = emptyMatch;
  semiFinal2: matchWithCompetitorsI = emptyMatch;
  final: matchWithCompetitorsI = emptyMatch;

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
          const blueFullName = joinNames(
            match.blueCompetitor.Participant.firstNames,
            match.blueCompetitor.Participant.lastNames
          );
          const redFullName = joinNames(
            match.redCompetitor.Participant.firstNames,
            match.redCompetitor.Participant.lastNames
          );

          match.blueCompetitor.Participant.fullName = blueFullName;
          match.redCompetitor.Participant.fullName = redFullName;
        }
        this.semiFinal1 = this.matchesWithCompetitors.find(
          (match) => match.round === 'semiFinal1'
        )!;
        this.semiFinal2 = this.matchesWithCompetitors.find(
          (match) => match.round === 'semiFinal2'
        )!;
        if (this.bracket.competitors.length === 3)
          this.final = this.matchesWithCompetitors.find(
            (match) => match.round === 'final'
          )!;
      });
  }

  createMatches() {
    const bracketSort1 = shuffleArray(this.bracket.competitors);
    const bracketSort2 = shuffleArray(bracketSort1);
    const bracketSort3 = shuffleArray(bracketSort2);

    const semiFinal1Match: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[0].competitorId,
      redCompetitorId: bracketSort3[1].competitorId,
      round: 'semiFinal1',
    };

    if (bracketSort3.length === 4) {
      const semiFinal2Match: matchToCreateI = {
        bracketId: this.bracket.bracketId,
        blueCompetitorId: bracketSort3[2].competitorId,
        redCompetitorId: bracketSort3[3].competitorId,
        round: 'semiFinal2',
      };
      this.postMatch(semiFinal2Match);
    } else {
      const semiFinal2Match: matchToCreateI = {
        bracketId: this.bracket.bracketId,
        blueCompetitorId: bracketSort3[2].competitorId,
        redCompetitorId: bracketSort3[2].competitorId,
        round: 'semiFinal2',
      };

      const final: matchToCreateI = {
        bracketId: this.bracket.bracketId,
        blueCompetitorId: null,
        redCompetitorId: bracketSort3[2].competitorId,
        round: 'final',
      };

      this.postMatch(semiFinal2Match);
      this.postMatch(final);
    }

    this.postMatch(semiFinal1Match);
  }

  postMatch(match: matchToCreateI | matchEmptyToCreateI) {
    this.api
      .postMatch(match, this.bracket.championshipId)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
      });
  }

  editCompetitor(competitorId: string) {
    this.editingBracket = competitorId;
    console.log(this.editingBracket);
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
