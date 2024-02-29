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
          const redFullName = joinNames(
            match.redCompetitor.Participant.firstNames,
            match.redCompetitor.Participant.lastNames
          );
          match.redCompetitor.Participant.fullName = redFullName;
          if (match.blueCompetitorId != null) {
            const blueFullName = joinNames(
              match.blueCompetitor.Participant.firstNames,
              match.blueCompetitor.Participant.lastNames
            );
            match.blueCompetitor.Participant.fullName = blueFullName;
          }
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
  //yara nicle // michelle // nicole //
  defineMatch1(match1Id: number, competitor1Id: string, competitor2Id: string) {
    const currentMatch1 = this.matchesWithCompetitors.find(
      (match) => match.matchId === match1Id
    );
    if (currentMatch1?.blueCompetitorId === currentMatch1?.redCompetitorId) {
      const editedMatch1 = {
        blueCompetitorId: competitor2Id,
        redCompetitorId: competitor2Id,
      };
      this.editMatch(match1Id, editedMatch1);
      this.editFinal(competitor2Id);
    }

    if (competitor1Id === currentMatch1?.blueCompetitorId) {
      const editedMatch1 = {
        blueCompetitorId: competitor2Id,
        redCompetitorId: currentMatch1.redCompetitorId,
      };
      this.editMatch(match1Id, editedMatch1);
    } else {
      const editedMatch1 = {
        blueCompetitorId: currentMatch1?.blueCompetitorId,
        redCompetitorId: competitor2Id,
      };
      this.editMatch(match1Id, editedMatch1);
    }
  }

  defineMatch2(competitor1Id: string, match2Id: number, competitor2Id: string) {
    const currentMatch2 = this.matchesWithCompetitors.find(
      (match) => match.matchId === match2Id
    );
    if (currentMatch2?.blueCompetitorId === currentMatch2?.redCompetitorId) {
      const editedMatch2 = {
        blueCompetitorId: competitor1Id,
        redCompetitorId: competitor1Id,
      };
      this.editMatch(match2Id, editedMatch2);
      this.editFinal(competitor1Id);
    }

    if (competitor2Id === currentMatch2?.blueCompetitorId) {
      const editedMatch2 = {
        blueCompetitorId: competitor1Id,
        redCompetitorId: currentMatch2.redCompetitorId,
      };
      this.editMatch(match2Id, editedMatch2);
    } else {
      const editedMatch2 = {
        blueCompetitorId: currentMatch2?.blueCompetitorId,
        redCompetitorId: competitor1Id,
      };
      this.editMatch(match2Id, editedMatch2);
    }
  }

  confirmEdit(match1Id: number, competitor1Id: string, competitor2Id: string) {
    const match2 = this.matchesWithCompetitors.find(
      (match) =>
        match.blueCompetitorId === competitor2Id ||
        match.redCompetitorId === competitor2Id
    );
    const match2Id = match2?.matchId;

    if (match2Id !== undefined) {
      if (match1Id === match2Id) {
        //Cambios en el mismo match
        const currentMatch = this.matchesWithCompetitors.find(
          (match) => match.matchId === match1Id
        );
        if (competitor1Id === currentMatch?.blueCompetitorId) {
          const editedMatch = {
            blueCompetitorId: competitor2Id,
            redCompetitorId: competitor1Id,
          };
          this.editMatch(match1Id, editedMatch);
        } else {
          const editedMatch = {
            blueCompetitorId: competitor1Id,
            redCompetitorId: competitor2Id,
          };
          this.editMatch(match1Id, editedMatch);
        }
      } else {
        this.defineMatch1(match1Id, competitor1Id, competitor2Id);
        this.defineMatch2(competitor1Id, match2Id, competitor2Id);
      }
    }
  }

  editMatch(matchId: number, editMatch: any) {
    this.api
      .editMatch(matchId, editMatch)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
        this.editingBracket = '';
        this.selectedCompetitorId = null;
      });
  }

  editFinal(competitorId: string) {
    const editedMatch = {
      redCompetitorId: competitorId,
    };
    this.editMatch(this.final.matchId, editedMatch);
  }
}
