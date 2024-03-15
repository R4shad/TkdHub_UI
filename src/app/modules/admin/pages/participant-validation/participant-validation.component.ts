import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantToValidateI } from 'src/app/shared/models/participant';
import {
  categoryI,
  categoryWithNumericValueI,
} from 'src/app/shared/models/category';
import { divisionI } from 'src/app/shared/models/division';
import { agesI } from 'src/app/shared/models/ages';
import {
  competitorI,
  responseCompetitorI,
} from 'src/app/shared/models/competitor';
import { responseI } from 'src/app/shared/models/response';
import { clubI } from 'src/app/shared/models/Club';
import {
  obtenerValorNumerico,
  getCompetitoryCategoryId,
  getCompetitorAgeIntervalId,
  getCompetitorDivisionId,
} from './../../utils/participantValidation.utils';
import { isDivisionWithinAgeInterval } from '../../utils/validation.utils';
@Component({
  selector: 'app-participant-validation',
  templateUrl: './participant-validation.component.html',
  styleUrls: ['./participant-validation.component.scss'],
})
export class ParticipantValidationComponent implements OnInit {
  championshipId: number = 0;

  participants: participantToValidateI[] = [];
  participantsFilter: participantToValidateI[] = [];

  categories: categoryI[] = [];
  categoriesWithNumericValue: categoryWithNumericValueI[] = [];

  divisions: divisionI[] = [];
  divisionsFilter: divisionI[] = [];

  ageIntervals: agesI[] = [];
  clubs: clubI[] = [];

  orderBy: string = '';
  orderDirection: 'asc' | 'desc' | 'normal' = 'normal';
  textoFiltro: string = '';
  showVerified: boolean | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.api.getParticipantsToVerify(this.championshipId).subscribe((data) => {
      this.participants = data;
      this.participantsFilter = data;
    });

    this.api.getChampionshipDivisions(this.championshipId).subscribe((data) => {
      this.divisions = data;
      this.divisionsFilter = data;
    });
    this.api
      .getChampionshipAgeInterval(this.championshipId)
      .subscribe((data) => {
        this.ageIntervals = data;
      });
    this.api.getClubs(this.championshipId).subscribe((data) => {
      this.clubs = data;
    });
    this.api
      .getChampionshipCategories(this.championshipId)
      .subscribe((data) => {
        this.categories = data;
        for (const category of data) {
          this.categoriesWithNumericValue.push({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            gradeMin: obtenerValorNumerico(category.gradeMin),
            gradeMax: obtenerValorNumerico(category.gradeMax),
          });
        }
      });
  }

  verificateParticipant(participant: participantToValidateI) {
    console.log(participant);
    this.api
      .verifyParticipant(this.championshipId, participant.id)
      .subscribe((data) => {
        const gradoParticipante = obtenerValorNumerico(participant.grade);
        const competitorCategoryId: number = getCompetitoryCategoryId(
          this.categoriesWithNumericValue,
          gradoParticipante
        );
        const ageIntervalId: number = getCompetitorAgeIntervalId(
          this.ageIntervals,
          participant.age
        );
        const competitorDivisionId: number = getCompetitorDivisionId(
          this.divisions,
          ageIntervalId,
          participant.weight,
          participant.gender
        );
        let newCompetitor: competitorI = {
          participantId: participant.id,
          championshipId: this.championshipId,
          divisionId: competitorDivisionId,
          categoryId: competitorCategoryId,
        };
        console.log(newCompetitor);
        this.api
          .postCompetitorAndIncrementCategoryAndDivision(
            newCompetitor,
            this.championshipId
          )
          .subscribe((response: number) => {
            if (response == 201) {
            }
          });
      });
  }

  verificateAll() {
    this.participants.forEach((participant) => {
      this.verificateParticipant(participant);
    });
  }

  aplicarFiltroTexto() {
    this.participantsFilter = this.participants.filter((participant) => {
      const nombres = participant.firstNames.toLowerCase();
      const apellidos = participant.lastNames.toLowerCase();
      const texto = this.textoFiltro.toLowerCase();
      return nombres.includes(texto) || apellidos.includes(texto);
    });
    this.filter();
  }

  toggleOrder(column: string) {
    if (column === 'verified') {
      if (this.orderBy === column) {
        if (this.orderDirection === 'normal') {
          this.orderDirection = 'desc';
        } else if (this.orderDirection === 'desc') {
          this.orderDirection = 'asc';
        } else {
          this.orderDirection = 'normal';
        }
      } else {
        this.orderBy = column;
        this.orderDirection = 'desc';
      }
      this.filter();
    } else {
      this.orderBy = column;
      if (this.orderDirection === 'normal') {
        this.orderDirection = 'asc';
      } else if (this.orderDirection === 'asc') {
        this.orderDirection = 'desc';
      } else {
        this.orderDirection = 'normal';
      }
      this.filter();
    }
  }
  filter() {
    if (this.showVerified !== null) {
      this.participantsFilter = this.participants.filter((participant) => {
        return participant.verified === this.showVerified;
      });
    }
    if (this.orderBy) {
      this.participantsFilter.sort((a, b) => {
        let valueA: string | number | boolean =
          a[this.orderBy as keyof participantToValidateI];
        let valueB: string | number | boolean =
          b[this.orderBy as keyof participantToValidateI];

        if (!(this.orderBy in a) || !(this.orderBy in b)) {
          return 0;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return this.orderDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          return this.orderDirection === 'asc'
            ? Number(valueA) - Number(valueB)
            : Number(valueB) - Number(valueA);
        }
      });
    }
  }

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }

  isDivisionWithinAgeIntervalC(
    division: divisionI,
    ageIntervalValue: string,
    ageFilter: string
  ): boolean {
    return isDivisionWithinAgeInterval(division, ageIntervalValue, ageFilter);
  }
}
