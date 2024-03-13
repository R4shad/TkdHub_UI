import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  championships: ChampionshipI[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    console.log('OnInit called');
    this.showAllChampionships();
  }

  showAllChampionships() {
    this.api.getAllChampionships().subscribe((data) => {
      this.championships = data;
    });
  }

  navigateToChampionship(championshipId: number) {
    const url = `/championship/${championshipId}`;
    this.router.navigateByUrl(url);
  }
}
