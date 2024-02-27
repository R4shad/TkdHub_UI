import { Component, OnInit, Input } from '@angular/core';
import {
  bracketI,
  bracketWithCompetitorsI,
} from 'src/app/shared/models/bracket';

@Component({
  selector: 'app-two-participants-bracket',
  templateUrl: './two-participants-bracket.component.html',
  styleUrls: ['./two-participants-bracket.component.scss'],
})
export class TwoParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;

  ngOnInit(): void {
    console.log('Datos del bracket:', this.bracket);
  }

  constructor() {}
}
