import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-championship-configuration',
  templateUrl: './championship-configuration.component.html',
  styleUrls: ['./championship-configuration.component.scss'],
})
export class ChampionshipConfigurationComponent implements OnInit {
  currentStep: number = 1;
  constructor() {}

  ngOnInit(): void {}

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }
}
