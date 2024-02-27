import { Component, OnInit, Input } from '@angular/core';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';

@Component({
  selector: 'app-eight-participants-bracket',
  templateUrl: './eight-participants-bracket.component.html',
  styleUrls: ['./eight-participants-bracket.component.scss'],
})
export class EightParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;

  ngOnInit(): void {
    console.log('Datos del bracket:', this.bracket);
  }

  constructor() {}
}
