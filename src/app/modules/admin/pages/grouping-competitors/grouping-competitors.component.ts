import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import {
  participantI,
  participantToEditI,
  responseParticipantToEditI,
} from 'src/app/shared/models/participant';
import { FormControl } from '@angular/forms';
import { clubI } from 'src/app/shared/models/Club';
import {
  competitorI,
  completeCompetitorI,
  completeCompetitorToEditI,
  participantCompetitorToEditI,
  responseCompetitorI,
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
  bracketInfoI,
  bracketWithCompetitorsEI,
  bracketWithCompetitorsToPostI,
  responseBracketI,
  responseBracketWithCompetitorI,
  responseBracketWithCompetitorToEditI,
  responseBracketsI,
} from 'src/app/shared/models/bracket';
import {
  obtenerColor,
  obtenerValorNumerico,
} from '../../utils/participantValidation.utils';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipI } from 'src/app/shared/models/Championship';

@Component({
  selector: 'app-grouping-competitors',
  templateUrl: './grouping-competitors.component.html',
  styleUrls: ['./grouping-competitors.component.scss'],
})
export class GroupingCompetitorsComponent implements OnInit {
  championshipId: number = 0;
  competitors: completeCompetitorI[] = [];
  validGrades: string[] = [];
  categories: categoryI[] = [];
  divisions: divisionI[] = [];

  bracketsQuantity: string[] = [];

  brackets: bracketWithCompetitorsEI[] = [];
  bracketsFiltered: bracketWithCompetitorsEI[] = [];

  bracketInfo: bracketInfoI[] = [];

  bracketEditing!: bracketInfoI;

  currentBracket: string = '';

  selectedGender: string = 'Ambos';
  selectedCategory: string = 'Todos';
  selectedAgeInterval: string = 'Todos';
  selectedDivision: string = 'Todos';
  selectedQuantity: string = 'Todos';
  modalRef?: NgbModalRef | undefined;
  ageIntervals: agesI[] = [];
  championship!: ChampionshipI;

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
      .getChampionshipCompetitors(this.championshipId)
      .subscribe((data) => {
        this.competitors = data;
      });

    this.getBrackets();
    this.api
      .getCategoriesWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.categories = data;
        this.validGrades = this.getValidGrades();
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

  getBrackets() {
    this.api
      .getBracketsWithCompetitorsToEdit(this.championshipId)
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

        // Ordenar el array de cantidades únicas
        this.bracketsQuantity.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

        //ordena el lastName de competidores
        this.brackets.forEach((bracket) => {
          if (bracket.competitors && bracket.competitors.length > 0) {
            bracket.competitors.sort(this.compareParticipants);
          }
        });
        this.bracketsFiltered = this.brackets;
        console.log(this.bracketsFiltered);
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

        if (competitorsInDivision.length >= 1) {
          const bracket: bracketWithCompetitorsToPostI = {
            categoryId: category.categoryId,
            divisionId: division.divisionId,
            championshipId: this.championshipId,
            competitors: competitorsInDivision,
          };
          this.api
            .postBracket(bracket)
            .subscribe((response: responseBracketWithCompetitorToEditI) => {
              console.log('RESPONSE:', response);
              if (response.status === 201) {
                this.getData();
              }
            });
        }
      }
    }
  }

  onEdit(
    participant: participantCompetitorToEditI,
    bracket: bracketWithCompetitorsEI
  ) {
    this.bracketsFiltered.forEach((bracket) => {
      bracket.competitors.forEach((competitor) => {
        competitor.participant.isEdit = false;
      });
    });
    participant.isEdit = true;
    const currentB = this.brackets.find(
      (b) => b.bracketId === bracket.bracketId
    );
    if (currentB) {
      const bd = this.getBracketDivision(currentB);
      const bc = this.getBracketCategory(currentB);
      if (bd && bc) {
        this.bracketEditing = {
          bracketId: currentB.bracketId,
          divisionId: currentB.divisionId,
          categoryId: currentB.categoryId,
          minWeight: bd.minWeight,
          maxWeight: bd.maxWeight,
          categoryName: bc.categoryName,
          championshipId: currentB.bracketId,
          infoToShow: this.getInfoToShow(
            bc.categoryName,
            bd.minWeight,
            bd.maxWeight
          ),
        };
        this.currentBracket = this.bracketEditing.infoToShow;
      }
    }

    this.getValidChanges(bracket);
  }

  confirmEdit(competitor: completeCompetitorToEditI) {
    const bracketToChange = this.bracketInfo.find(
      (b) => b.infoToShow === this.currentBracket
    );

    //Actualizar los datos del competidor.
    if (this.currentBracket === this.bracketEditing.infoToShow) {
    } else {
      //Si cambio la categoria
      if (competitor.categoryId != bracketToChange?.categoryId) {
        this.api
          .decrementCategory(competitor.championshipId, competitor.categoryId)
          .subscribe((data) => {
            if (data.status === 200) {
              this.resetFilters();
              this.api
                .incrementCategoryAndDivision(
                  competitor.championshipId,
                  -1,
                  competitor.categoryId
                )
                .subscribe((data) => {
                  if (data) {
                  }
                });
            }
          });
      }
      //Cambios en la division
      if (competitor.divisionId != bracketToChange?.divisionId) {
        this.api
          .decrementDivision(competitor.championshipId, competitor.divisionId)
          .subscribe((data) => {
            if (data.status === 200) {
              this.api
                .incrementCategoryAndDivision(
                  competitor.championshipId,
                  competitor.divisionId,
                  -1
                )
                .subscribe((data) => {
                  if (data) {
                  }
                });
            }
          });
      }
      if (bracketToChange) {
        const infoToEdit: competitorI = {
          participantId: competitor.competitorId,
          championshipId: competitor.championshipId,
          divisionId: bracketToChange.divisionId,
          categoryId: bracketToChange?.categoryId,
        };

        this.api
          .editCompetitor(competitor.competitorId, infoToEdit)
          .subscribe((data) => {
            if (data.status === 200) {
              console.log('TODO BIEN');
              this.getData();
            }
          });
      }
    }

    let bracketDecreased = this.brackets.find(
      (bracket) => bracket.bracketId === this.bracketEditing.bracketId
    );

    if (bracketDecreased != null) {
      if (
        bracketDecreased.competitors.length === 0 ||
        bracketDecreased.competitors.length === 1
      ) {
        console.log('eliminar bracket');
        this.api
          .deleteBracket(bracketDecreased.bracketId)
          .subscribe((response: responseBracketI) => {
            console.log('RESPONSE DEL ELIMINAR:', response);
            if (response.status == 200) {
              //alert('Eliminado correctamente');
            }
          });
      }
    }

    this.visibleBrackets = 1;
    this.resetFilters();
    this.getBrackets();
  }
  cancelEdit(participant: participantCompetitorToEditI) {
    participant.isEdit = false;
  }

  getBracketGrouping(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );

    if (matchingDivision) {
      const matchingAgeInterval = this.ageIntervals.find(
        (age) => age.ageIntervalId === matchingDivision.ageIntervalId
      );
      if (matchingAgeInterval) {
        if (matchingAgeInterval.maxAge === 100) {
          return '+' + matchingAgeInterval.minAge;
        }
        return matchingAgeInterval.minAge + '-' + matchingAgeInterval.maxAge;
      }
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

  getBracketCategoryName(bracket: bracketI) {
    const matchingCategory = this.categories.find(
      (cat) => cat.categoryId === bracket.categoryId
    );
    if (matchingCategory) {
      return matchingCategory.categoryName;
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

  compareParticipants(a: any, b: any) {
    const lastNameA = a.participant.lastNames.toLowerCase();
    const lastNameB = b.participant.lastNames.toLowerCase();

    if (lastNameA < lastNameB) return -1;
    if (lastNameA > lastNameB) return 1;
    return 0;
  }

  getInfoToShow(cName: string, bmW: number, bMW: number) {
    if (bmW === 0) {
      return cName + '| -' + bMW + ' Kg';
    }
    if (bMW === 100) {
      return cName + '| +' + bmW + ' Kg';
    }
    return cName + '| ' + bmW + '-' + bMW + ' Kg';
  }

  getValidGrades(): string[] {
    const coloresValidos: string[] = [];

    const categoriasOrdenadas = this.categories.sort(
      (a, b) =>
        obtenerValorNumerico(a.gradeMin) - obtenerValorNumerico(b.gradeMin)
    );

    for (const categoria of categoriasOrdenadas) {
      const valorMin = obtenerValorNumerico(categoria.gradeMin);
      const valorMax = obtenerValorNumerico(categoria.gradeMax);

      for (let i = valorMin; i <= valorMax; i++) {
        // Llama a obtenerColor con el valor numérico actual de la iteración
        const color = obtenerColor(i);

        if (color) {
          coloresValidos.push(color);
        }
      }
    }
    return coloresValidos;
  }

  joinNames(firstNames: string, lastNames: string) {
    const firstName = firstNames.split(' ')[0];
    const lastName = lastNames.split(' ')[0];
    return `${firstName} ${lastName}`;
  }

  getValidChanges(bracket: bracketWithCompetitorsEI) {
    this.bracketInfo = [];
    const division = this.getBracketDivision(bracket);
    const category = this.getBracketCategory(bracket);

    for (const iterBracket of this.brackets) {
      const iterDivision = this.getBracketDivision(iterBracket);
      const iterCategory = this.getBracketCategory(iterBracket);

      if (category && iterCategory && iterDivision && division) {
        const iterDategoryMinGrade = obtenerValorNumerico(
          iterCategory.gradeMin
        );
        const categoryMaxGrade = obtenerValorNumerico(category?.gradeMax);
        const categoryMinGrade = obtenerValorNumerico(category?.gradeMin);
        //bracket.bracketId != iterBracket.bracketId
        if (true) {
          if (division.gender === iterDivision.gender) {
            if (
              iterDategoryMinGrade >= categoryMaxGrade ||
              iterDategoryMinGrade === categoryMinGrade
            ) {
              if (
                iterDivision.minWeight >= division.maxWeight ||
                iterDivision.minWeight === division.minWeight
              ) {
                this.bracketInfo.push({
                  bracketId: iterBracket.bracketId,
                  divisionId: iterBracket.divisionId,
                  categoryId: iterBracket.categoryId,
                  minWeight: iterDivision.minWeight,
                  maxWeight: iterDivision.maxWeight,
                  categoryName: iterCategory.categoryName,
                  championshipId: iterBracket.championshipId,
                  infoToShow: this.getInfoToShow(
                    iterCategory.categoryName,
                    iterDivision.minWeight,
                    iterDivision.maxWeight
                  ),
                });
              }
            }
          }
        }
      }
    }
    return this.bracketInfo;
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
  onDelete(
    competitor: completeCompetitorToEditI,
    bracket: bracketWithCompetitorsEI
  ) {
    const confirmation = window.confirm(
      '¿Estás seguro que quieres eliminar este Competidor?'
    );
    const cId = competitor.categoryId;
    const dId = competitor.divisionId;
    console.log('ASDASDASDASDASDASDASDASDASDASD');
    console.log(confirmation);
    if (confirmation) {
      console.log('ID:', competitor.competitorId);
      this.api
        .deleteCompetitor(competitor.competitorId)
        .subscribe((response: responseCompetitorI) => {
          console.log('RESPONSE 01:', response);
          console.log(response);
          if (response.status == 200) {
            //Hay   que eliminar el bracket, el competidor, y reducir el numero en categoria y division.
            this.visibleBrackets = 1;
            this.resetFilters();
            this.getBrackets();
            alert('Competidor Eliminado correctamente');
          }
        });
      bracket.competitors = bracket.competitors.filter(
        (c) => c.competitorId != competitor.competitorId
      );
      console.log('COMPETITORS: ', bracket.competitors);
      if (
        bracket.competitors.length === 0 ||
        bracket.competitors.length === 1
      ) {
        console.log('eliminar bracket');
        this.api
          .deleteBracket(bracket.bracketId)
          .subscribe((response: responseBracketI) => {
            console.log('RESPONSE DEL ELIMINAR:', response);
            if (response.status == 200) {
              //alert('Eliminado correctamente');
            }
          });
      } else {
        console.log('Toca decrementar');
        this.api
          .decrementCategory(bracket.championshipId, cId)
          .subscribe((data) => {
            console.log('RESPONSE DEL decrementar category:', data);
            if (data.status === 200) {
            }
          });
        this.api
          .decrementDivision(bracket.championshipId, dId)
          .subscribe((data) => {
            console.log('RESPONSE DEL decrementar division:', data);
            if (data.status === 200) {
            }
          });
      }
    }
  }

  resetFilters() {
    this.bracketsFiltered = this.brackets;
    this.selectedAgeInterval = 'Todos';
    this.selectedCategory = 'Todos';
    this.selectedGender = 'Ambos';
    this.selectedQuantity = 'Todos';
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
              '/Championship',
              this.championshipId,
              'Organizer',
            ]);
          }
        });
    } else {
      console.warn('modalRef no está definido'); // Muestra una advertencia si modalRef no está definido
    }
  }
}
