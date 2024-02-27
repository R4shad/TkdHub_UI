import { Component, OnInit, Input } from '@angular/core';
import { bracketWithCompetitorsI } from 'src/app/shared/models/bracket';

@Component({
  selector: 'app-sixteen-participants-bracket',
  templateUrl: './sixteen-participants-bracket.component.html',
  styleUrls: ['./sixteen-participants-bracket.component.scss'],
})
export class SixteenParticipantsBracketComponent implements OnInit {
  @Input() bracket!: bracketWithCompetitorsI;

  ngOnInit(): void {
    console.log('Datos del bracket:', this.bracket);
  }

  constructor() {}
}
