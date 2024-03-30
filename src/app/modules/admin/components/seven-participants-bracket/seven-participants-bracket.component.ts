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
import { joinNames } from '../../utils/joinCompetitorNames.utils';
import { shuffleArray } from '../../utils/shuffleParticipants.utils';

@Component({
  selector: 'app-seven-participants-bracket',
  templateUrl: './seven-participants-bracket.component.html',
  styleUrls: ['./seven-participants-bracket.component.scss'],
})
export class SevenParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  quarters1: matchWithCompetitorsI = emptyMatch;
  quarters2: matchWithCompetitorsI = emptyMatch;
  quarters3: matchWithCompetitorsI = emptyMatch;
  quarters4: matchWithCompetitorsI = emptyMatch;

  semiFinal1: matchWithCompetitorsI = emptyMatch;
  semiFinal2: matchWithCompetitorsI = emptyMatch;
  final: matchWithCompetitorsI = emptyMatch;

  editingBracket: string = '';
  selectedCompetitorId: string | null = null;

  loading: boolean = false;
  ngOnInit(): void {
    this.getMatches();
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        if (data.length === 0) {
          this.createMatches();
        }
      });
  }

  constructor(private api: ApiService) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        for (const match of this.matchesWithCompetitors) {
          if (match.redCompetitorId != null) {
            const redFullName = joinNames(
              match.redCompetitor.participant.firstNames,
              match.redCompetitor.participant.lastNames
            );
            match.redCompetitor.participant.fullName = redFullName;
          }
          if (match.blueCompetitorId != null) {
            const blueFullName = joinNames(
              match.blueCompetitor.participant.firstNames,
              match.blueCompetitor.participant.lastNames
            );
            match.blueCompetitor.participant.fullName = blueFullName;
          }
        }

        this.quarters1 = this.matchesWithCompetitors.find(
          (match) => match.round === 'quarters1'
        )!;
        this.quarters2 = this.matchesWithCompetitors.find(
          (match) => match.round === 'quarters2'
        )!;
        this.quarters3 = this.matchesWithCompetitors.find(
          (match) => match.round === 'quarters3'
        )!;
        this.quarters4 = this.matchesWithCompetitors.find(
          (match) => match.round === 'quarters4'
        )!;
        this.semiFinal1 = this.matchesWithCompetitors.find(
          (match) => match.round === 'semifinal1'
        )!;
        this.semiFinal2 = this.matchesWithCompetitors.find(
          (match) => match.round === 'semifinal2'
        )!;
      });
    console.log(this.matchesWithCompetitors);
    console.log('QUARTESR:', this.quarters1);
    if (this.matchesWithCompetitors.length === 0) {
      //this.createMatches();
    }
  }

  createMatches() {
    const bracketSort1 = shuffleArray(this.bracket.competitors);
    const bracketSort2 = shuffleArray(bracketSort1);
    const bracketSort3 = shuffleArray(bracketSort2);

    const quarters1: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[0].competitorId,
      redCompetitorId: bracketSort3[1].competitorId,
      round: 'quarters1',
    };
    this.postMatch(quarters1);
    const quarters2: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[2].competitorId,
      redCompetitorId: bracketSort3[3].competitorId,
      round: 'quarters2',
    };
    this.postMatch(quarters2);
    const quarters3: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[4].competitorId,
      redCompetitorId: bracketSort3[5].competitorId,
      round: 'quarters3',
    };
    this.postMatch(quarters3);
    const quarters4: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[6].competitorId,
      redCompetitorId: bracketSort3[6].competitorId,
      round: 'quarters4',
    };
    this.postMatch(quarters4);

    const semifinal1: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'semifinal1',
    };
    this.postMatch(semifinal1);
    const semifinal2: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: bracketSort3[6].competitorId,
      round: 'semifinal2',
    };
    this.postMatch(semifinal2);
    const final: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'final',
    };
    this.postMatch(final);
    const winner: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: null,
      round: 'winner',
    };
    this.postMatch(winner);
  }

  postMatch(match: matchToCreateI | matchEmptyToCreateI) {
    this.api
      .postMatch(match, this.bracket.championshipId)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
      });
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

  defineMatch1(match1Id: number, competitor1Id: string, competitor2Id: string) {
    const currentMatch1 = this.matchesWithCompetitors.find(
      (match) => match.matchId === match1Id
    );
    console.log(currentMatch1);
    if (currentMatch1?.blueCompetitorId === currentMatch1?.redCompetitorId) {
      console.log('ENTRE BIEN MATCH1');
      const editedMatch1 = {
        blueCompetitorId: competitor2Id,
        redCompetitorId: competitor2Id,
      };
      this.editMatch(match1Id, editedMatch1);
      if (currentMatch1?.matchId === this.quarters2.matchId) {
        this.editAdvance(competitor2Id, this.semiFinal1.matchId, 'red');
      } else {
        if (currentMatch1?.matchId === this.quarters3.matchId) {
          this.editAdvance(competitor2Id, this.semiFinal2.matchId, 'blue');
        } else {
          if (currentMatch1?.matchId === this.quarters4.matchId) {
            this.editAdvance(competitor2Id, this.semiFinal2.matchId, 'red');
          }
        }
      }
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
      console.log('ENTRE BIEN MATCH2');
      const editedMatch2 = {
        blueCompetitorId: competitor1Id,
        redCompetitorId: competitor1Id,
      };
      this.editMatch(match2Id, editedMatch2);
      if (currentMatch2?.matchId === this.quarters2.matchId) {
        this.editAdvance(competitor1Id, this.semiFinal1.matchId, 'red');
      } else {
        if (currentMatch2?.matchId === this.quarters3.matchId) {
          this.editAdvance(competitor1Id, this.semiFinal2.matchId, 'blue');
        } else {
          if (currentMatch2?.matchId === this.quarters4.matchId) {
            this.editAdvance(competitor1Id, this.semiFinal2.matchId, 'red');
          }
        }
      }
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

  editMatch(matchId: number, editMatch: any) {
    console.log('AAAAAAAAAAAAAAAAAAA', matchId);
    console.log(editMatch);
    this.api
      .editMatch(matchId, editMatch)
      .subscribe((response: responseMatchI) => {
        this.getMatches();
        this.editingBracket = '';
        this.selectedCompetitorId = null;
      });
  }

  editAdvance(
    competitorId: string,
    matchToAdvanceId: number,
    colorToEdit: string
  ) {
    if (colorToEdit === 'red') {
      console.log('entre edit advance red: ');
      const editedMatch = {
        redCompetitorId: competitorId,
      };
      this.editMatch(matchToAdvanceId, editedMatch);
    } else {
      console.log('entre edit advance blue: ');
      const editedMatch = {
        blueCompetitorId: competitorId,
      };
      this.editMatch(matchToAdvanceId, editedMatch);
    }
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
}
