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

  compareParticipants(a: any, b: any) {
    const lastNameA = a.participant.lastNames.toLowerCase();
    const lastNameB = b.participant.lastNames.toLowerCase();

    if (lastNameA < lastNameB) return -1;
    if (lastNameA > lastNameB) return 1;
    return 0;
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

  getBracketGrouping(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.grouping;
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

  onEdit(participant: participantCompetitorToEditI) {
    if (!participant.isEdit) {
      participant.isEdit = true;
    }
  }

  confirmEdit(participant: participantCompetitorToEditI) {
    const newParticipant: participantToEditI = {
      lastNames: participant.lastNames,
      firstNames: participant.firstNames,
      age: participant.age,
      weight: participant.weight,
      grade: participant.grade,
      gender: participant.gender,
    };
    //Actualizar los datos del participante.
    //Actualizar la division del competidor.
    //Actualizar el conteo de la vieja y nueva division.
    //Actualizar la categoria del competidor.
    //Actualizar el conteo de la nueva y vieja division.
    this.api
      .editParticipant(this.championshipId, participant.id, newParticipant)
      .subscribe((response: responseParticipantToEditI) => {
        if (response.status == 200) {
          alert('Editado correctamente');
          participant.isEdit = false;

          //this.getCompetitorDivision(participant);
          //this.getCategory(participant);
        }
      });
  }

  cancelEdit(participant: participantCompetitorToEditI) {
    participant.isEdit = false;
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
}
