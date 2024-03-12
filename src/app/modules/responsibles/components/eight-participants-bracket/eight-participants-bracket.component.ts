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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-eight-participants-bracket',
  templateUrl: './eight-participants-bracket.component.html',
  styleUrls: ['./eight-participants-bracket.component.scss'],
})
export class EightParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;
  matchesWithCompetitors: matchWithCompetitorsI[] = [];

  eights1: matchWithCompetitorsI = emptyMatch;
  eights2: matchWithCompetitorsI = emptyMatch;
  eights3: matchWithCompetitorsI = emptyMatch;
  eights4: matchWithCompetitorsI = emptyMatch;

  semiFinal1: matchWithCompetitorsI = emptyMatch;
  semiFinal2: matchWithCompetitorsI = emptyMatch;
  final: matchWithCompetitorsI = emptyMatch;

  editingBracket: string = '';

  loading: boolean = false;

  selecedMatch: matchWithCompetitorsI = emptyMatch;

  modalRef?: NgbModalRef;
  ngOnInit(): void {
    this.getMatches();
  }
  showModal: boolean = false;
  constructor(private api: ApiService, private modalService: NgbModal) {}

  getMatches() {
    this.api
      .getMatches(this.bracket.championshipId, this.bracket.bracketId)
      .subscribe((data) => {
        this.matchesWithCompetitors = data;
        for (const match of this.matchesWithCompetitors) {
          if (match.blueCompetitorId != null) {
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
        if (this.bracket.competitors.length === 5) {
          this.semiFinal1 = this.matchesWithCompetitors.find(
            (match) => match.round === 'semifinal1'
          )!;
        }
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

  onModalClose($event: any) {
    this.showModal = false;
    console.log(this.showModal);
  }

  openModal(match: matchWithCompetitorsI) {
    this.selecedMatch = match;
    this.showModal = true;
  }
}
