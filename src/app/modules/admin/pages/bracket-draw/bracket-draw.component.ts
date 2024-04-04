import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

import { jsPDF } from 'jspdf';
import {
  bracketI,
  bracketWithCompetitorsI,
  bracketWithMatchesI,
} from 'src/app/shared/models/bracket';
import { divisionI } from 'src/app/shared/models/division';
import { categoryI } from 'src/app/shared/models/category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { agesI } from 'src/app/shared/models/ages';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bracket-draw',
  templateUrl: './bracket-draw.component.html',
  styleUrls: ['./bracket-draw.component.scss'],
})
export class BracketDrawComponent implements OnInit {
  championshipId: number = 0;

  brackets: bracketWithCompetitorsI[] = [];
  bracketsFiltered: bracketWithCompetitorsI[] = [];

  divisions: divisionI[] = [];
  categories: categoryI[] = [];

  selectedGender: string = 'Ambos';
  selectedCategory: string = 'Todos';
  selectedAgeInterval: string = 'Todos';
  selectedDivision: string = 'Todos';
  modalRef?: NgbModalRef | undefined;
  divisionsFilter: divisionI[] = [];
  ageIntervals: agesI[] = [];
  championship!: ChampionshipI;

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

        this.api
          .getMatches(this.championshipId, this.brackets[0].bracketId)
          .subscribe((data) => {
            if (!data[0].matchNumber) {
              this.api.enumerateMatch(this.championshipId).subscribe((data) => {
                this.getData();
              });
            }
          });

        console.log(this.brackets);
        this.bracketsFiltered = this.brackets;
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
    this.applyDivisionFilter();
  }

  filterCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }

  filterAgeInterval(interval: string) {
    this.selectedAgeInterval = interval;
    this.applyFilters();
    this.applyDivisionFilter();
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

  applyDivisionFilter() {
    if (this.selectedGender != 'Ambos') {
      this.divisionsFilter = this.divisions.filter((division) => {
        const gender = this.selectedGender;
        return gender === division.gender;
      });
    }
    if (this.selectedAgeInterval != 'Todos') {
      const ageIntervalSelected = this.ageIntervals.find((age) => {
        const [minAge, maxAge] = this.selectedAgeInterval.split('-');
        return age.minAge === Number(minAge) && age.maxAge === Number(maxAge);
      });
      if (ageIntervalSelected) {
        this.divisionsFilter = this.divisionsFilter.filter((division) => {
          const ageIntervalId = division.ageIntervalId;
          return ageIntervalId === ageIntervalSelected.ageIntervalId;
        });
      }
    }
  }

  applyFilters() {
    this.bracketsFiltered = this.brackets;
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

  confirm() {
    if (this.modalRef) {
      // Verifica si modalRef está definido
      this.api
        .updateChampionshipStage(this.championshipId)
        .subscribe((data) => {
          if (data === 200) {
            if (this.modalRef != undefined) {
              this.modalRef.close(); // Cierra modalRef solo si está definido
            }
            this.router.navigate([
              '/championship',
              this.championshipId,
              'Organizer',
            ]);
          }
        });
    } else {
    }
  }

  generatePDF(): void {
    const url = `/championship/${this.championshipId}/Organizer/BracketDraw/DownloadBracket`;
    window.open(url, '_blank');
  }
}
