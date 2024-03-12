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
import { emptyMatch, matchWithCompetitorsI } from 'src/app/shared/models/match';

@Component({
  selector: 'app-define-winner-modal',
  templateUrl: './define-winner-modal.component.html',
  styleUrls: ['./define-winner-modal.component.scss'],
})
export class DefineWinnerModalComponent implements OnInit {
  @Input() match: matchWithCompetitorsI = emptyMatch;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  isSelected: number | null = null;
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
      this.closeModal.emit();
    }
  }

  changeColor(index: number) {
    // Si ya estaba seleccionado, lo deseleccionamos
    if (this.isSelected === index) {
      this.isSelected = null;
    } else {
      // Si no estaba seleccionado, lo marcamos como seleccionado
      this.isSelected = index;
    }
  }
}
