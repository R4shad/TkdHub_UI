import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ChampionshipI } from 'src/app/shared/models/Championship';
@Component({
  selector: 'app-championship-configuration',
  templateUrl: './championship-configuration.component.html',
  styleUrls: ['./championship-configuration.component.scss'],
})
export class ChampionshipConfigurationComponent implements OnInit {
  currentStep: number = 1;
  championship!: ChampionshipI;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          // Obtén el championshipId del parámetro de la ruta
          const championshipId: number = Number(params.get('championshipId'));

          // Utiliza championshipId para hacer la solicitud al servicio
          return this.api.getChampionshipInfo(championshipId);
        })
      )
      .subscribe((data) => {
        this.championship = data;
        console.log(this.championship);
      });
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  returnToSummary() {
    const championshipId = this.championship.championshipId;
    this.router.navigate(['/championship', championshipId, 'Organizer']);
  }

  resetInitialData() {
    console.log('reiniciando');
    this.api
      .deleteAllAgeInterval(this.championship.championshipId)
      .subscribe((data) => {
        console.log(data);
      });
    this.api
      .deleteAllCategories(this.championship.championshipId)
      .subscribe((data) => {
        console.log(data);
      });
    this.api
      .postChampionshipCategory(this.championship.championshipId)
      .subscribe((data) => {
        console.log(data);
      });
    this.api
      .postChampionshipDivision(this.championship.championshipId)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
