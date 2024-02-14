import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantI } from 'src/app/shared/models/participant';
import { FormControl } from '@angular/forms';
import { clubI } from 'src/app/shared/models/Club';
import {
  competitorI,
  completeCompetitorI,
} from 'src/app/shared/models/competitor';

@Component({
  selector: 'app-grouping-competitors',
  templateUrl: './grouping-competitors.component.html',
  styleUrls: ['./grouping-competitors.component.scss'],
})
export class GroupingCompetitorsComponent implements OnInit {
  competitors: completeCompetitorI[] = [];
  clubs: clubI[] = [];
  competitorsFilter: completeCompetitorI[] = [];
  genterFilter = new FormControl('');
  clubFilter = new FormControl('');
  championshipId: number = 0;
  clubCode: string = '';
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.getClubs();
    this.displayCompetitors();
  }

  getCurrentRoute(): string {
    return this.route.snapshot.url.map((segment) => segment.path).join('/');
  }

  displayCompetitors() {
    this.api
      .getChampionshipCompetitors(this.championshipId)
      .subscribe((data) => {
        console.log(data);
        this.competitors = data;
        this.competitorsFilter = data;
      });
  }

  getClubs() {
    console.log(this.championshipId);
    this.api.getClubs(this.championshipId).subscribe((data) => {
      this.clubs = data;
    });
  }

  filterGender() {
    const genderFilter = this.genterFilter.value;
    console.log(genderFilter);
    if (genderFilter === 'todos') {
      this.competitorsFilter = this.competitors;
    } else {
      // Filtrar inscritos por sexo
      this.competitorsFilter = this.competitors.filter(
        (competitor) => competitor.Participant.gender === genderFilter
      );
    }
  }

  filterClub() {
    const clubFilter = this.clubFilter.value;
    console.log(clubFilter);
    if (clubFilter === 'todos') {
      this.competitorsFilter = this.competitors;
    } else {
      // Filtrar inscritos por sexo
      this.competitorsFilter = this.competitors.filter(
        (competitor) => competitor.Participant.clubCode === clubFilter
      );
    }
  }

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }
}
