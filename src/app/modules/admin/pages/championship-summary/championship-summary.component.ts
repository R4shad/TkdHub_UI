import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantI } from 'src/app/shared/models/participant';
import { FormControl } from '@angular/forms';
import { clubI } from 'src/app/shared/models/Club';
import { ChampionshipStage } from 'src/app/shared/models/enums';
import { ChampionshipI } from 'src/app/shared/models/Championship';

@Component({
  selector: 'app-championship-summary',
  templateUrl: './championship-summary.component.html',
  styleUrls: ['./championship-summary.component.scss'],
})
export class ChampionshipSummaryComponent implements OnInit {
  championshipId: number = 0;
  championship!: ChampionshipI;
  stage: number = 0;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
      this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
        this.championship = data;
      });
    });

    this.api.getChampionshipStage(this.championshipId).subscribe((data) => {
      this.stage = this.obtainNumericStage(data);
      console.log(this.stage);
      this.update(this.stage);
    });
  }

  obtainNumericStage(stage: string): number {
    switch (stage) {
      case ChampionshipStage.Etapa1:
        return 1;
      case ChampionshipStage.Etapa2:
        return 2;
      case ChampionshipStage.Etapa3:
        return 3;
      case ChampionshipStage.Etapa4:
        return 4;
      case ChampionshipStage.Etapa5:
        return 5;
      case ChampionshipStage.Etapa6:
        return 6;
      case ChampionshipStage.Etapa7:
        return 7;
      case ChampionshipStage.Etapa8:
        return 8;
      case ChampionshipStage.Etapa9:
        return 9;
      default:
        return 0;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStep']) {
      this.update(changes['currentStep'].currentValue);
    }
  }

  private update(currentActive: number): void {
    const progress: any = document.getElementById('progress');
    const stepCircles = document.querySelectorAll('.circle');

    stepCircles.forEach((circle, i) => {
      if (i < currentActive) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });

    const activeCircles = document.querySelectorAll('.active');
    progress.style.width =
      ((activeCircles.length - 1) / (stepCircles.length - 1)) * 100 + '%';
  }

  getCurrentRoute(): string {
    return this.route.snapshot.url.map((segment) => segment.path).join('/');
  }

  goToTraineeRegistration() {
    const currentRoute = this.getCurrentRoute();
    this.router.navigate([currentRoute, 'TraineeRegistration']);
  }

  goToChampionshipConfiguration() {
    const currentRoute = this.getCurrentRoute();
    this.router.navigate([currentRoute, 'ChampionshipConfiguration']);
  }

  goToParticipantValidation() {
    const currentRoute = this.getCurrentRoute();
    this.router.navigate([currentRoute, 'ParticipantValidation']);
  }

  goToCompetitorsGrouping() {
    const currentRoute = this.getCurrentRoute();
    this.router.navigate([currentRoute, 'Grouping']);
  }

  goToBracketDraw() {
    const currentRoute = this.getCurrentRoute();
    this.router.navigate([currentRoute, 'BracketDraw']);
  }

  goToResponsibleRegistration() {
    const currentRoute = this.getCurrentRoute();
    this.router.navigate([currentRoute, 'ResponsibleRegistration']);
  }

  goToChampionshipSummary() {
    const currentRoute = this.getCurrentRoute();
    const updatedRoute = currentRoute.replace('/Organizer', '/Summary');
    this.router.navigate([updatedRoute]);
  }

  goToBracketResults() {
    const currentRoute = this.getCurrentRoute();
    const parts = currentRoute.split('/');
    parts[2] = 'Responsible';
    parts[3] = 'BracketResults';

    const newRoute = parts.join('/');

    this.router.navigate([newRoute]);
  }
}
