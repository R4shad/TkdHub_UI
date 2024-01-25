import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
    this.getInfo();
  }

  getInfo() {
    const championshipId: number = Number(
      this.route.snapshot.paramMap.get('championshipId')
    );

    // Ahora puedes usar championshipId como sea necesario
    console.log('Championship ID:', championshipId);

    // Luego, puedes utilizar championshipId para hacer la solicitud al servicio
    this.api.getChampionshipInfo(championshipId).subscribe((data) => {
      this.championship = data;
      console.log(this.championship);
    });
  }
}
