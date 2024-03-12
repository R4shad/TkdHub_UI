import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/services/api.service';
import {
  emptyMatch,
  matchModalI,
  matchWinnerI,
  matchWithCompetitorsI,
  responseMatchI,
} from 'src/app/shared/models/match';

@Component({
  selector: 'app-define-winner-modal',
  templateUrl: './define-winner-modal.component.html',
  styleUrls: ['./define-winner-modal.component.scss'],
})
export class DefineWinnerModalComponent implements OnInit {
  @Input() match!: matchModalI;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  isSelected: number | null = null;
  winnerCompetitorId: string = '';
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    console.log('Match ID:', this.match.matchId);
    this.openModel();
  }

  openModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }

  closeModel() {
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
      this.closeModal.emit(false);
    }
  }

  confirmWinner() {
    if (this.isSelected !== null) {
      this.updateMatchWinner(this.getMatchWinner());
      this.closeModal.emit(true);
      console.log('CONFIRMED');
      this.advanceWinner();
    }
    const modelDiv = document.getElementById('myModal');
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
  }

  advanceWinner() {
    console.log(this.match.round);
    if (this.match.round == 'quarters1') {
      this.getAdvanceMatchId('semifinal1').subscribe({
        next: (matchToAdvanceId) => {
          this.updateMatchAdvanceWinner(matchToAdvanceId, {
            blueCompetitorId: this.winnerCompetitorId,
          });
        },
        error: (error) => {
          console.error('Error fetching matchToAdvanceId:', error);
        },
      });
    }
  }

  getAdvanceMatchId(round: string) {
    return this.api.getMatchId(this.match.bracketId, round);
  }

  updateMatchAdvanceWinner(matchAdvanceId: number, matchUpdated: any) {
    this.api
      .editMatch(matchAdvanceId, matchUpdated)
      .subscribe((response: responseMatchI) => {});
  }

  updateMatchWinner(matchWinner: matchWinnerI) {
    this.api
      .editMatch(this.match.matchId, matchWinner)
      .subscribe((response: responseMatchI) => {});
  }

  changeColor(index: number) {
    if (this.isSelected === index) {
      this.isSelected = null;
    } else {
      this.isSelected = index;
    }
  }

  getMatchWinner(): matchWinnerI {
    switch (this.isSelected) {
      case 0:
        this.winnerCompetitorId = this.match.redCompetitorId;
        return { blueRounds: 0, redRounds: 2 };
      case 1:
        this.winnerCompetitorId = this.match.redCompetitorId;
        return { blueRounds: 1, redRounds: 2 };
      case 2:
        this.winnerCompetitorId = this.match.blueCompetitorId;
        return { blueRounds: 2, redRounds: 1 };
      case 3:
        this.winnerCompetitorId = this.match.blueCompetitorId;
        return { blueRounds: 2, redRounds: 0 };
      default:
        return { blueRounds: 0, redRounds: 0 };
    }
  }
}
