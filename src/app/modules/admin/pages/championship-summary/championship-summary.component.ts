import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-championship-summary',
  templateUrl: './championship-summary.component.html',
  styleUrls: ['./championship-summary.component.scss'],
})
export class ChampionshipSummaryComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  getCurrentRoute(): string {
    return this.route.snapshot.url.map((segment) => segment.path).join('/');
  }

  goToTraineeRegistration() {
    const currentRoute = this.getCurrentRoute();

    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'TraineeRegistration']);
  }

  goToChampionshipConfiguration() {
    const currentRoute = this.getCurrentRoute();

    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'ChampionshipConfiguration']);
  }
}
