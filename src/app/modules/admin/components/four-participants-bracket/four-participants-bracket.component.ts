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
import { completeCompetitorI } from 'src/app/shared/models/competitor';

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
  ngOnInit(): void {
    this.getMatches();
  }

  constructor(private api: ApiService) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        if (this.matchesWithCompetitors.length === 0) {
          this.createMatches();
        } else {
          this.semiFinal1 = this.matchesWithCompetitors.find(
            (match) => match.round === 'semiFinal1'
          )!;
          this.semiFinal2 = this.matchesWithCompetitors.find(
            (match) => match.round === 'semiFinal2'
          )!;
          this.final = this.matchesWithCompetitors.find(
            (match) => match.round === 'final'
          )!;
        }
      });
  }

  createMatches() {
    const semiFinal1Match: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'semiFinal1',
    };
    const semiFinal2Match: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'semiFinal2',
    };
    const FinalMatch: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'final',
    };
    this.postMatch(semiFinal1Match);
    this.postMatch(semiFinal2Match);
    this.postMatch(FinalMatch);

    this.putMatches();
  }

  putMatches() {
    const bracketSort1 = shuffleArray(this.bracket.competitors);
    const bracketSort2 = shuffleArray(bracketSort1);
    const bracketSort3 = shuffleArray(bracketSort2);

    const semiFinal1Match = {
      blueCompetitorId: bracketSort3[0].competitorId,
      redCompetitorId: bracketSort3[1].competitorId,
    };
    this.editMatch(this.semiFinal1.matchId, semiFinal1Match);

    if (bracketSort3.length === 4) {
      const semiFinal2Match = {
        blueCompetitorId: bracketSort3[2].competitorId,
        redCompetitorId: bracketSort3[3].competitorId,
      };
      this.editMatch(this.semiFinal2.matchId, semiFinal2Match);
    } else {
      const semiFinal2Match = {
        blueCompetitorId: bracketSort3[2].competitorId,
        redCompetitorId: bracketSort3[2].competitorId,
      };
      this.editMatch(this.semiFinal2.matchId, semiFinal2Match);

      const finalMatch = {
        redCompetitorId: bracketSort3[2].competitorId,
      };
      this.editMatch(this.final.matchId, finalMatch);
    }
  }

  postMatch(match: matchToCreateI | matchEmptyToCreateI) {
    console.log(match);
    this.api
      .postMatch(match, this.bracket.championshipId)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
      });
  }

  editMatch(matchId: number, match: any) {
    this.api.editMatch(matchId, match).subscribe((response: responseMatchI) => {
      this.getMatches();
    });
  }
}
