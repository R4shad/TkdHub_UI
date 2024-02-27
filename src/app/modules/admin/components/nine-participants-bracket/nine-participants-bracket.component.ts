import { Component, OnInit, Input } from '@angular/core';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';

@Component({
  selector: 'app-nine-participants-bracket',
  templateUrl: './nine-participants-bracket.component.html',
  styleUrls: ['./nine-participants-bracket.component.scss'],
})
export class NineParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;

  ngOnInit(): void {
    console.log('Datos del bracket:', this.bracket);
  }

  constructor() {}
}
