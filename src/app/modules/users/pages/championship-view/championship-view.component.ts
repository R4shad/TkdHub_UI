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
    this.route.paramMap.subscribe((params) => {
      const championshipId: number = Number(params.get('championshipId'));
      this.api.getChampionshipInfo(championshipId).subscribe((data) => {
        this.championship = data;
        console.log(this.championship);
      });
    });
  }

  formatFecha(fecha: string): string {
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];
    const año = fechaObj.getFullYear();

    return `${dia} de ${mes} del ${año}`;
  }
  goToBracketView() {
    this.router.navigate([
      'Championship/' + this.championship.championshipId + '/BracketViwer',
    ]);
  }
}
