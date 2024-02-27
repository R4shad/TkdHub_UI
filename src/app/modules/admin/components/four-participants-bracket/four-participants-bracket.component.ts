import { Component, OnInit, Input } from '@angular/core';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';

@Component({
  selector: 'app-four-participants-bracket',
  templateUrl: './four-participants-bracket.component.html',
  styleUrls: ['./four-participants-bracket.component.scss'],
})
export class FourParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;

  ngOnInit(): void {
    console.log('Datos del bracket:', this.bracket);
  }

  constructor() {}
}
