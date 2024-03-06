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
  bracketWithCompetitorsToPostI,
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
  championshipId: number = 0;
  competitors: completeCompetitorI[] = [];

  categories: categoryI[] = [];
  divisions: divisionI[] = [];

  brackets: bracketWithCompetitorsI[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });

    this.getData();
  }

  getData() {
    this.api
      .getChampionshipCompetitors(this.championshipId)
      .subscribe((data) => {
        this.competitors = data;
      });

    this.api
      .getBracketsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.brackets = data;
      });

    this.api
      .getCategoriesWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.categories = data;
      });

    this.api
      .getDivisionsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.divisions = data;
        for (const division of this.divisions) {
          this.api.getDivisionData(division.divisionId).subscribe((data) => {
            division.ageIntervalId = data.ageIntervalId;
            division.gender = data.gender;
            division.grouping = data.grouping;
            division.minWeight = data.minWeight;
            division.maxWeight = data.maxWeight;
          });
        }
      });
  }

  createGroupings() {
    for (const category of this.categories) {
      for (const division of this.divisions) {
        const competitorsInDivision = this.competitors.filter(
          (competitor) =>
            competitor.divisionId === division.divisionId &&
            competitor.categoryId === category.categoryId
        );

        if (competitorsInDivision.length >= 2) {
          const bracket: bracketWithCompetitorsToPostI = {
            categoryId: category.categoryId,
            divisionId: division.divisionId,
            championshipId: this.championshipId,
            competitors: competitorsInDivision,
          };

          this.api
            .postBracket(bracket)
            .subscribe((response: responseBracketWithCompetitorI) => {
              this.brackets.push(response.data);
            });
        }
      }
    }
  }

  getBracketGrouping(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.grouping;
    }
    return null;
  }
  getBracketMinWeightInterval(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.minWeight;
    }
    return null;
  }
  getBracketMaxWeightInterval(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.maxWeight;
    }
    return null;
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
}
