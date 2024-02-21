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
import {
  categoryI,
  championshipCategoryI,
} from 'src/app/shared/models/category';
import {
  championshipDivisionI,
  divisionI,
} from 'src/app/shared/models/division';
import {
  bracketI,
  bracketWithCompetitorsI,
  responseBracketI,
  responseBracketWithCompetitorI,
  responseBracketsI,
} from 'src/app/shared/models/bracket';

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

  championshipCategories: categoryI[] = [];
  championshipDivisions: divisionI[] = [];
  brackets: bracketWithCompetitorsI[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.brackets);
    console.log(this.brackets.length);
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.getClubs();
    this.displayCompetitors();

    this.getApiDivisions();
    this.getApiCategories();
    this.getBrackets();
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
    this.api.getClubs(this.championshipId).subscribe((data) => {
      this.clubs = data;
    });
  }

  getBrackets() {
    this.api
      .getBracketsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.brackets = data;
        console.log(this.brackets);
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
    //console.log(clubFilter);
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

  goToBracketDraw() {
    this.router.navigate([
      '/championship',
      this.championshipId,
      'Organizer',
      'BracketDraw',
    ]);
  }

  createGroupings() {
    for (const category of this.championshipCategories) {
      for (const division of this.championshipDivisions) {
        const competitorsInDivision = this.competitors.filter(
          (competitor) =>
            competitor.divisionName === division.divisionName &&
            competitor.categoryName === category.categoryName
        );

        if (competitorsInDivision.length >= 2) {
          const bracket: bracketWithCompetitorsI = {
            categoryName: category.categoryName,
            divisionName: division.divisionName,
            championshipId: this.championshipId,
            competitors: competitorsInDivision,
          };

          this.api
            .postBracket(bracket)
            .subscribe((response: responseBracketWithCompetitorI) => {
              console.log(response);
              this.brackets.push(bracket);
            });
        }
      }
    }
  }

  getApiDivisions() {
    this.api
      .getDivisionsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.championshipDivisions = data;

        for (const division of this.championshipDivisions) {
          this.api.getDivisionData(division.divisionName).subscribe((data) => {
            division.ageIntervalId = data.ageIntervalId;
            division.gender = data.gender;
            division.grouping = data.grouping;
            division.minWeight = data.minWeight;
            division.maxWeight = data.maxWeight;
          });
        }
      });
  }
  getApiCategories() {
    this.api
      .getCategoriesWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.championshipCategories = data;
      });
  }
  getBracketGrouping(bracket: bracketI) {
    const matchingDivision = this.championshipDivisions.find(
      (div) => div.divisionName === bracket.divisionName
    );
    if (matchingDivision) {
      return matchingDivision.grouping;
    }
    return null;
  }

  getBracketWeightInterval(bracket: bracketI) {
    const matchingDivision = this.championshipDivisions.find(
      (div) => div.divisionName === bracket.divisionName
    );
    if (matchingDivision) {
      return matchingDivision.minWeight + '-' + matchingDivision.maxWeight;
    }
    return null;
  }
}
