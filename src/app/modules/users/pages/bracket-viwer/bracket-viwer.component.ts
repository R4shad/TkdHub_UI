import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/services/api.service';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { agesI } from 'src/app/shared/models/ages';
import {
  bracketI,
  bracketWithCompetitorsI,
} from 'src/app/shared/models/bracket';
import { categoryI } from 'src/app/shared/models/category';
import { divisionI } from 'src/app/shared/models/division';
@Component({
  selector: 'app-bracket-viwer',
  templateUrl: './bracket-viwer.component.html',
  styleUrls: ['./bracket-viwer.component.scss'],
})
export class BracketViwerComponent implements OnInit {
  championshipId: number = 0;

  brackets: bracketWithCompetitorsI[] = [];
  bracketsFiltered: bracketWithCompetitorsI[] = [];

  divisions: divisionI[] = [];
  categories: categoryI[] = [];

  selectedGender: string = 'Ambos';
  selectedCategory: string = 'Todos';
  selectedAgeInterval: string = 'Todos';
  selectedDivision: string = 'Todos';
  selectedQuantity: string = 'Todos';
  modalRef?: NgbModalRef | undefined;
  ageIntervals: agesI[] = [];
  championship!: ChampionshipI;

  bracketsQuantity: string[] = [];
  visibleBrackets: number = 1;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });

    this.getData();
  }

  get displayedBrackets() {
    return this.bracketsFiltered.slice(0, this.visibleBrackets);
  }

  showMoreBrackets() {
    this.visibleBrackets += 1;
  }

  showLessBrackets() {
    this.visibleBrackets -= 1;
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }
  getData() {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
      this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
        this.championship = data;
      });
    });

    this.api
      .getBracketsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.brackets = data;

        for (const bracket of this.brackets) {
          // Obtener la cantidad de participantes en el bracket actual
          const cant = bracket.competitors.length + '';

          // Si la cantidad de participantes actual no está en el array de cantidades únicas, agregarla
          if (!this.bracketsQuantity.includes(cant)) {
            if (cant != '0') {
              this.bracketsQuantity.push(cant);
            }
          }
        }
        this.bracketsQuantity.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        setTimeout(() => {
          this.api
            .getMatches(this.championshipId, this.brackets[0].bracketId)
            .subscribe((data) => {
              if (!data[0].matchNumber) {
                this.api
                  .enumerateMatch(this.championshipId)
                  .subscribe((data) => {
                    this.getData();
                  });
              }
            });
        }, 5000);

        console.log(this.brackets);
        setTimeout(() => {
          this.bracketsFiltered = this.brackets;
        }, 3000);
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
        this.api
          .getChampionshipAgeInterval(this.championshipId)
          .subscribe((data) => {
            this.ageIntervals = data;
            this.ageIntervals.sort((a, b) => a.minAge - b.minAge);

            this.ageIntervals = this.ageIntervals.filter((interval) =>
              this.divisions.some(
                (division) => division.ageIntervalId === interval.ageIntervalId
              )
            );
          });
      });
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

  getBracketCategoryName(bracket: bracketI) {
    const category = this.categories.find(
      (cat) => cat.categoryId === bracket.categoryId
    );
    if (category) {
      return category.categoryName;
    }
    return null;
  }
  getBracketDivision(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision;
    }
    return null;
  }

  getBracketCategory(bracket: bracketI) {
    const matchingCategory = this.categories.find(
      (cat) => cat.categoryId === bracket.categoryId
    );
    if (matchingCategory) {
      return matchingCategory;
    }
    return null;
  }

  filterGender(selected: string) {
    this.selectedGender = selected;
    this.applyFilters();
  }

  filterCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }

  filterAgeInterval(interval: string) {
    this.selectedAgeInterval = interval;
    this.applyFilters();
  }

  filterDivision(divisionWeight: string) {
    this.selectedDivision = divisionWeight;
    if (divisionWeight === 'Todos') {
      this.bracketsFiltered = this.brackets;
      return;
    }
    const [minWeight, maxWeight] = divisionWeight.split('-');
    this.bracketsFiltered = this.brackets.filter((bracket) => {
      const division = this.divisions.find(
        (div) => div.divisionId === bracket.divisionId
      );
      if (division) {
        return (
          division.minWeight === Number(minWeight) &&
          division.maxWeight === Number(maxWeight)
        );
      } else return;
    });
  }

  filterQuantity(interval: string) {
    this.selectedQuantity = interval;
    this.applyFilters();
  }

  applyFilters() {
    this.visibleBrackets = 1;
    this.bracketsFiltered = this.brackets;
    // Aplicar filtro de cantidad
    if (this.selectedQuantity !== 'Todos') {
      this.bracketsFiltered = this.bracketsFiltered.filter(
        (bracket) => bracket.competitors.length + '' === this.selectedQuantity
      );
    }
    // Aplicar filtro de género
    if (this.selectedGender !== 'Ambos') {
      this.bracketsFiltered = this.bracketsFiltered.filter(
        (bracket) =>
          bracket.competitors[0].participant.gender === this.selectedGender
      );
    }
    // Aplicar filtro de categoría
    if (this.selectedCategory !== 'Todos') {
      const category: categoryI | undefined = this.categories.find(
        (category) => category.categoryName === this.selectedCategory
      );
      if (category) {
        this.bracketsFiltered = this.bracketsFiltered.filter(
          (bracket) => bracket.categoryId === category.categoryId
        );
      }
    }

    // Aplicar filtro de intervalo de edades si se proporcionan minAge y maxAge
    if (this.selectedAgeInterval !== 'Todos') {
      const [minAge, maxAge] = this.selectedAgeInterval.split('-');
      const ageInterval = this.ageIntervals.find(
        (age) =>
          age.minAge === parseInt(minAge) && age.maxAge === parseInt(maxAge)
      );
      const divisions = this.divisions.filter(
        (div) => div.ageIntervalId === ageInterval?.ageIntervalId
      );

      if (divisions) {
        this.bracketsFiltered = this.bracketsFiltered.filter((bracket) =>
          divisions.some(
            (division) => division.divisionId === bracket.divisionId
          )
        );
      }
    }
  }
}
