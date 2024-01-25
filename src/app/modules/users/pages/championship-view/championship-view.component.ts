import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-championship-view',
  templateUrl: './championship-view.component.html',
  styleUrls: ['./championship-view.component.scss'],
})
export class ChampionshipViewComponent implements OnInit {
  championship!: ChampionshipI;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('OnInit called');

    // Suscríbete a los cambios en los parámetros de la ruta
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

  goToLogin() {
    // Obtén el championshipId del campeonato actual
    const championshipId = this.championship.championshipId; // Asegúrate de tener la propiedad correcta que almacena el id

    // Navega a la ruta http://localhost:4200/championship/8/login
    this.router.navigate(['/championship', championshipId, 'login']);
  }
}
