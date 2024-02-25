import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-four-participants-bracket',
  templateUrl: './four-participants-bracket.component.html',
  styleUrls: ['./four-participants-bracket.component.scss'],
})
export class FourParticipantsBracketComponent implements OnInit {
  displayBracket: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
