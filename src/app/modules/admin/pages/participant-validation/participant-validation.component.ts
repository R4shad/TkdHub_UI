import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantToValidateI } from 'src/app/shared/models/participant';
import {
  categoryI,
  categoryWithNumericValueI,
} from 'src/app/shared/models/category';
import { divisionI } from 'src/app/shared/models/division';
import { agesI, championshipAgesI } from 'src/app/shared/models/ages';
import { competitorI } from 'src/app/shared/models/competitor';
@Component({
  selector: 'app-participant-validation',
  templateUrl: './participant-validation.component.html',
  styleUrls: ['./participant-validation.component.scss'],
})
export class ParticipantValidationComponent implements OnInit {
  championshipId: number = 0;
  participants: participantToValidateI[] = [];
  participantsFilter: participantToValidateI[] = [];
  championshipCategories: categoryWithNumericValueI[] = [];
  championshipDivisions: divisionI[] = [];
  championshipAgeIntreval: agesI[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.displayParticipants();
  }
  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }

  displayParticipants() {
    this.api.getParticipantsToVerify(this.championshipId).subscribe((data) => {
      this.participants = data;
      this.participantsFilter = data;
    });
    this.getApiCategories();
    this.getApiDivisions();
    this.getApiAgeInterval();
  }

  getApiDivisions() {
    this.api.getChampionshipDivisions(this.championshipId).subscribe((data) => {
      this.championshipDivisions = data;
    });
  }

  getApiAgeInterval() {
    this.api
      .getChampionshipAgeInterval(this.championshipId)
      .subscribe((data) => {
        this.championshipAgeIntreval = data;
      });
  }

  getApiCategories() {
    this.api
      .getChampionshipCategories(this.championshipId)
      .subscribe((data) => {
        for (const category of data) {
          this.championshipCategories.push({
            categoryName: category.categoryName,
            gradeMin: this.obtenerValorNumerico(category.gradeMin),
            gradeMax: this.obtenerValorNumerico(category.gradeMax),
          });
        }
        console.log(this.championshipCategories);
      });
  }

  verificateParticipant(participant: participantToValidateI) {
    this.api
      .verifyParticipant(this.championshipId, participant.participantCi)
      .subscribe((data) => {
        console.log(data.message);
        // Actualizar el estado del participante a "Verificado"
        participant.verified = true;

        const gradoParticipante = this.obtenerValorNumerico(participant.grade);
        const competitoryCategory: string =
          this.getCompetitoryCategory(gradoParticipante);
        const ageIntervalId: number = this.getCompetitoryAgeIntervalId(
          participant.age
        );

        /*let newCompetitor: competitorI = {
          participantCi= participant.participantCi,
          championshipId: this.championshipId;
          divisionName: competitoryCategory;
          categoryName: ageIntervalId;
        }*/
        console.log(competitoryCategory);
        console.log(ageIntervalId);
      });
  }

  obtenerValorNumerico(grado: string): number {
    switch (grado.toLowerCase()) {
      case 'franja amarillo':
        return 1;
      case 'amarillo':
        return 2;
      case 'franja verde':
        return 3;
      case 'verde':
        return 4;
      case 'franja azul':
        return 5;
      case 'azul':
        return 6;
      case 'franja rojo':
        return 7;
      case 'rojo':
        return 8;
      case 'franja negro':
        return 9;
      case 'negro':
        return 10;
      default:
        return 0; // Valor por defecto o para casos no manejados
    }
  }

  getCompetitoryCategory(gradoParticipante: number): string {
    for (const categoria of this.championshipCategories) {
      if (
        gradoParticipante >= categoria.gradeMin &&
        gradoParticipante <= categoria.gradeMax
      ) {
        return categoria.categoryName;
      }
    }
    return '';
  }

  getCompetitoryAgeIntervalId(age: number): number {
    for (const ageInterval of this.championshipAgeIntreval) {
      if (age >= ageInterval.minAge && age <= ageInterval.maxAge) {
        return ageInterval.id;
      }
    }
    return 0;
  }
}
