import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bracket-draw',
  templateUrl: './bracket-draw.component.html',
  styleUrls: ['./bracket-draw.component.scss'],
})
export class BracketDrawComponent implements OnInit {
  displayBracket: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
