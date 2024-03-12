import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';
import {
  emptyMatch,
  matchEmptyToCreateI,
  matchModalI,
  matchToCreateI,
  matchWithCompetitorsI,
  responseMatchI,
} from 'src/app/shared/models/match';
import { joinNames } from '../../utils/joinCompetitorNames.utils';
import { shuffleArray } from '../../utils/shuffleParticipants.utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-eight-participants-bracket',
  templateUrl: './eight-participants-bracket.component.html',
  styleUrls: ['./eight-participants-bracket.component.scss'],
})
export class EightParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  quarters1: matchWithCompetitorsI = emptyMatch;
  quarters2: matchWithCompetitorsI = emptyMatch;
  quarters3: matchWithCompetitorsI = emptyMatch;
  quarters4: matchWithCompetitorsI = emptyMatch;

  semiFinal1: matchWithCompetitorsI = emptyMatch;
  semiFinal2: matchWithCompetitorsI = emptyMatch;
  final: matchWithCompetitorsI = emptyMatch;

  loading: boolean = false;

  selecedMatch!: matchModalI;

  modalRef?: NgbModalRef;
  ngOnInit(): void {
    this.getMatches();
  }
  showModal: boolean = false;
  constructor(private api: ApiService, private modalService: NgbModal) {}

  getMatches() {
    console.log(this.bracket.categoryId);
    console.log(this.bracket.bracketId);
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        for (const match of this.matchesWithCompetitors) {
          if (match.redCompetitorId != null) {
            const redFullName = joinNames(
              match.redCompetitor.Participant.firstNames,
              match.redCompetitor.Participant.lastNames
            );
            match.redCompetitor.Participant.fullName = redFullName;
          }
          if (match.blueCompetitorId != null) {
            const blueFullName = joinNames(
              match.blueCompetitor.Participant.firstNames,
              match.blueCompetitor.Participant.lastNames
            );
            match.blueCompetitor.Participant.fullName = blueFullName;
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
        if (
          this.bracket.competitors.length === 6 ||
          this.bracket.competitors.length === 7
        ) {
          this.semiFinal2 = this.matchesWithCompetitors.find(
            (match) => match.round === 'semifinal2'
          )!;
        }
      });
  }

  onModalClose($event: boolean) {
    this.showModal = false;
    if ($event) {
      this.getMatches();
    }
  }

  openModal(match: matchWithCompetitorsI) {
    this.selecedMatch = {
      matchId: match.matchId,
      bracketId: match.bracketId,
      blueCompetitorName: match.blueCompetitor.Participant.fullName,
      redCompetitorName: match.redCompetitor.Participant.fullName,

      blueCompetitorId: match.blueCompetitor.competitorId,
      redCompetitorId: match.redCompetitor.competitorId,

      round: match.round,
    };
    this.showModal = true;
  }

  matchHasWinner(match: matchWithCompetitorsI) {
    if (match.redRounds != 0 || match.blueRounds != 0) {
      return false;
    }
    return true;
  }
}
