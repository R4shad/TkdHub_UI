import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { categoryI } from 'src/app/shared/models/category';
import { bracketI } from 'src/app/shared/models/bracket';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { divisionI } from 'src/app/shared/models/division';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  championshipId: number = 0;
  bracketResults: any[] = [];
  championship!: ChampionshipI;
  visibleBrackets: number = 1;
  categories: categoryI[] = [];
  divisions: divisionI[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
      this.getData();
    });
  }

  getData() {
    this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
      this.championship = data;
    });

    this.api.getBracketsResults(this.championshipId).subscribe((data) => {
      this.bracketResults = data;
      console.log(this.bracketResults);
    });

    this.api
      .getCategoriesWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.categories = data;
        console.log(this.categories);
      });

    this.api
      .getDivisionsByChampionship(this.championshipId)
      .subscribe((data) => {
        this.divisions = data;
        console.log(this.divisions);
      });
  }

  getBracketCategoryName(categoryId: number) {
    const matchingCategory = this.categories.find(
      (cat) => cat.categoryId === categoryId
    );
    if (matchingCategory) {
      return matchingCategory.categoryName;
    }
    return null;
  }

  getBracketGrouping(divisionId: number) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === divisionId
    );
    if (matchingDivision) {
      const divisionName = matchingDivision.divisionName;
      const firstWord = divisionName.split(' ')[0];
      return firstWord;
    }
    return null;
  }

  getGender(id: number): string | undefined {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === id
    );
    return matchingDivision ? matchingDivision.gender : undefined;
  }

  getBracketMinWeightInterval(divisionId: number) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === divisionId
    );
    return matchingDivision ? matchingDivision.minWeight : null;
  }

  getBracketMaxWeightInterval(divisionId: number) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === divisionId
    );
    return matchingDivision ? matchingDivision.maxWeight : null;
  }

  showMoreBrackets() {
    this.visibleBrackets += 1;
  }

  showLessBrackets() {
    this.visibleBrackets -= 1;
  }

  get displayedBrackets() {
    return this.bracketResults.slice(0, this.visibleBrackets);
  }
}
