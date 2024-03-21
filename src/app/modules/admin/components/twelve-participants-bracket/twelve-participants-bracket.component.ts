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
  selector: 'app-twelve-participants-bracket',
  templateUrl: './twelve-participants-bracket.component.html',
  styleUrls: ['./twelve-participants-bracket.component.scss'],
})
export class TwelveParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  eights1: matchWithCompetitorsI = emptyMatch;
  eights2: matchWithCompetitorsI = emptyMatch;
  eights3: matchWithCompetitorsI = emptyMatch;
  eights4: matchWithCompetitorsI = emptyMatch;
  eights5: matchWithCompetitorsI = emptyMatch;
  eights6: matchWithCompetitorsI = emptyMatch;
  eights7: matchWithCompetitorsI = emptyMatch;
  eights8: matchWithCompetitorsI = emptyMatch;

  quarters1: matchWithCompetitorsI = emptyMatch;
  quarters2: matchWithCompetitorsI = emptyMatch;
  quarters3: matchWithCompetitorsI = emptyMatch;
  quarters4: matchWithCompetitorsI = emptyMatch;

  //semiFinal1: matchWithCompetitorsI = emptyMatch;
  //semiFinal2: matchWithCompetitorsI = emptyMatch;
  //final: matchWithCompetitorsI = emptyMatch;

  editingBracket: string = '';
  selectedCompetitorId: string | null = null;

  loading: boolean = false;
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
          if (match.redCompetitor != null) {
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
        this.eights1 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights1'
        )!;
        this.eights2 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights2'
        )!;
        this.eights3 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights3'
        )!;
        this.eights4 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights4'
        )!;
        this.eights5 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights5'
        )!;
        this.eights6 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights6'
        )!;
        this.eights7 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights7'
        )!;
        this.eights8 = this.matchesWithCompetitors.find(
          (match) => match.round === 'eights8'
        )!;

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
        console.log(this.quarters4);
      });
  }

  createMatches() {
    const bracketSort1 = shuffleArray(this.bracket.competitors);
    const bracketSort2 = shuffleArray(bracketSort1);
    const bracketSort3 = shuffleArray(bracketSort2);

    const eights1: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[0].competitorId,
      redCompetitorId: bracketSort3[1].competitorId,
      round: 'eights1',
    };
    this.postMatch(eights1);
    const eights2: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[2].competitorId,
      redCompetitorId: bracketSort3[2].competitorId,
      round: 'eights2',
    };
    this.postMatch(eights2);
    const eights3: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[3].competitorId,
      redCompetitorId: bracketSort3[4].competitorId,
      round: 'eights3',
    };
    this.postMatch(eights3);
    const eights4: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[5].competitorId,
      redCompetitorId: bracketSort3[5].competitorId,
      round: 'eights4',
    };
    this.postMatch(eights4);
    const eights5: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[6].competitorId,
      redCompetitorId: bracketSort3[7].competitorId,
      round: 'eights5',
    };
    this.postMatch(eights5);
    const eights6: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[8].competitorId,
      redCompetitorId: bracketSort3[8].competitorId,
      round: 'eights6',
    };
    this.postMatch(eights6);
    const eights7: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[9].competitorId,
      redCompetitorId: bracketSort3[10].competitorId,
      round: 'eights7',
    };
    this.postMatch(eights7);
    const eights8: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: bracketSort3[11].competitorId,
      redCompetitorId: bracketSort3[11].competitorId,
      round: 'eights8',
    };
    this.postMatch(eights8);

    const quarters1: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: bracketSort3[2].competitorId,
      round: 'quarters1',
    };
    this.postMatch(quarters1);
    const quarters2: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: bracketSort3[5].competitorId,
      round: 'quarters2',
    };
    this.postMatch(quarters2);
    const quarters3: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: bracketSort3[8].competitorId,
      round: 'quarters3',
    };
    this.postMatch(quarters3);
    const quarters4: matchToCreateI = {
      bracketId: this.bracket.bracketId,
      blueCompetitorId: null,
      redCompetitorId: bracketSort3[11].competitorId,
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
      redCompetitorId: null,
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
      if (currentMatch1?.matchId === this.eights2.matchId) {
        this.editAdvance(competitor2Id, this.quarters1.matchId, 'red');
      }
      if (currentMatch1?.matchId === this.eights4.matchId) {
        this.editAdvance(competitor2Id, this.quarters2.matchId, 'red');
      }
      if (currentMatch1?.matchId === this.eights6.matchId) {
        this.editAdvance(competitor2Id, this.quarters3.matchId, 'red');
      }
      if (currentMatch1?.matchId === this.eights8.matchId) {
        this.editAdvance(competitor2Id, this.quarters4.matchId, 'red');
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

      if (currentMatch2?.matchId === this.eights2.matchId) {
        this.editAdvance(competitor1Id, this.quarters1.matchId, 'red');
      }
      if (currentMatch2?.matchId === this.eights4.matchId) {
        this.editAdvance(competitor1Id, this.quarters2.matchId, 'red');
      }
      if (currentMatch2?.matchId === this.eights6.matchId) {
        this.editAdvance(competitor1Id, this.quarters3.matchId, 'red');
      }
      if (currentMatch2?.matchId === this.eights8.matchId) {
        this.editAdvance(competitor1Id, this.quarters4.matchId, 'red');
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
