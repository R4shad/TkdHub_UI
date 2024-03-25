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

  brackets: bracketWithCompetitorsEI[] = [];

  bracketInfo: bracketInfoI[] = [];

  bracketEditing!: bracketInfoI;

  currentBracket: string = '';
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
      .getBracketsWithCompetitorsToEdit(this.championshipId)
      .subscribe((data) => {
        this.brackets = data;
        //ordena el lastName de competidores
        this.brackets.forEach((bracket) => {
          if (bracket.competitors && bracket.competitors.length > 0) {
            bracket.competitors.sort(this.compareParticipants);
          }
        });
        console.log(this.brackets);
      });
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
            .subscribe((response: responseBracketWithCompetitorToEditI) => {
              if (response.data) {
                const bracketWithEdit: bracketWithCompetitorsEI = {
                  ...response.data,
                  competitors: response.data.competitors.map((competitor) => ({
                    ...competitor,
                    participant: {
                      ...competitor.participant,
                      isEdit: false,
                    },
                  })),
                };
                this.brackets.push(bracketWithEdit);
              }
            });
        }
      }
    }
  }

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }

  onEdit(
    participant: participantCompetitorToEditI,
    bracket: bracketWithCompetitorsEI
  ) {
    this.brackets.forEach((bracket) => {
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
    console.log(this.currentBracket);
    console.log('EN CONFIRM');
    console.log(this.bracketInfo);
    const bracketToChange = this.bracketInfo.find(
      (b) => b.infoToShow === this.currentBracket
    );

    //Actualizar los datos del competidor.
    if (this.currentBracket === this.bracketEditing.infoToShow) {
    } else {
      //Si cambio la categoria
      console.log('CAMBIOS CATEGORIA');
      console.log('CURRENT BRACKET:', this.bracketEditing);
      console.log('CURRENT COMPETITOR:', competitor);
      console.log('BRACKET TO CHANGE:', bracketToChange);
      if (competitor.categoryId != bracketToChange?.categoryId) {
        console.log('CAMBIANDO CATEGORIA');
        this.api
          .decrementCategory(competitor.championshipId, competitor.categoryId)
          .subscribe((data) => {
            console.log('DATA DECREMENT C1:', data);
            if (data.status === 200) {
              this.api
                .incrementCategoryAndDivision(
                  competitor.championshipId,
                  -1,
                  competitor.categoryId
                )
                .subscribe((data) => {
                  console.log('DATA DECREMENT C2:', data);
                  if (data) {
                  }
                });
            }
          });
      }
      //Cambios en la division
      console.log('CAMBIOS Division');
      if (competitor.divisionId != bracketToChange?.divisionId) {
        console.log('CAMBIANDO DIVISION');
        this.api
          .decrementDivision(competitor.championshipId, competitor.divisionId)
          .subscribe((data) => {
            console.log('DATA DECREMENT D1:', data);
            if (data.status === 200) {
              this.api
                .incrementCategoryAndDivision(
                  competitor.championshipId,
                  competitor.divisionId,
                  -1
                )
                .subscribe((data) => {
                  console.log('DATA DECREMENT D2:', data);
                  if (data) {
                    console.log('LLEGUE FINAL');
                  }
                });
            }
          });
      }
      //Actualizar datos del competidor
      console.log('CAMBIOS COMPETIDOR');
      if (bracketToChange) {
        console.log('ENTRE BRACKETOCHANGE');
        console.log(competitor);
        const infoToEdit: competitorI = {
          participantId: competitor.competitorId,
          championshipId: competitor.championshipId,
          divisionId: bracketToChange.divisionId,
          categoryId: bracketToChange?.categoryId,
        };

        this.api
          .editCompetitor(competitor.competitorId, infoToEdit)
          .subscribe((data) => {
            console.log(data);
            if (data.status === 200) {
              console.log('TODO BIEN');
              console.log(competitor);
            }
          });
      }
    }

    //Actualizar la division del competidor.
    //Actualizar el conteo de la vieja y nueva division.
    //Actualizar la categoria del competidor.
    //Actualizar el conteo de la nueva y vieja division.
  }
  cancelEdit(participant: participantCompetitorToEditI) {
    console.log(this.currentBracket);
    participant.isEdit = false;
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
                console.log('BRACKETCITOOOOOOO:', iterBracket);
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
}
