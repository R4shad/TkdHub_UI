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
          .postCompetitor(newCompetitor, this.championshipId)
          .subscribe((response: responseCompetitorI) => {
            if (response.status == 201) {
              participant.verified = true;
              this.api.incrementCategoryAndDivision(
                this.championshipId,
                competitorDivisionId,
                competitorCategoryId
              );
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
    // Filtrar los participantes basados en el texto ingresado
    this.participantsFilter = this.participants.filter((participant) => {
      // Filtrar por nombres y apellidos
      const nombres = participant.firstNames.toLowerCase();
      const apellidos = participant.lastNames.toLowerCase();
      const texto = this.textoFiltro.toLowerCase();
      return nombres.includes(texto) || apellidos.includes(texto);
    });

    // Aplicar el filtro de ordenamiento después de filtrar por texto
    this.filter();
  }

  toggleOrder(column: string) {
    if (column === 'verified') {
      // Cambiar el orden solo si la columna es 'verified'
      if (this.orderBy === column) {
        // Si se hace clic en la misma columna, cambiar la dirección del orden
        if (this.orderDirection === 'normal') {
          this.orderDirection = 'desc'; // Cambia a descendente si estaba en normal
        } else if (this.orderDirection === 'desc') {
          this.orderDirection = 'asc'; // Cambia a ascendente si estaba en descendente
        } else {
          this.orderDirection = 'normal'; // Cambia a normal si estaba en ascendente
        }
      } else {
        // Si se hace clic en una nueva columna, establecerla como columna de orden y dirección ascendente
        this.orderBy = column;
        this.orderDirection = 'desc';
      }
      // Aplicar el filtro con el nuevo orden
      this.filter();
    } else {
      // Para otras columnas, usar el comportamiento existente
      this.orderBy = column; // Establecer la columna de orden
      if (this.orderDirection === 'normal') {
        this.orderDirection = 'asc'; // Cambiar a ascendente si estaba en normal
      } else if (this.orderDirection === 'asc') {
        this.orderDirection = 'desc'; // Cambiar a descendente si estaba en ascendente
      } else {
        this.orderDirection = 'normal'; // Cambiar a normal si estaba en descendente
      }
      // Aplicar el filtro con el nuevo orden
      this.filter();
    }
  }
  filter() {
    if (this.showVerified !== null) {
      this.participantsFilter = this.participants.filter((participant) => {
        return participant.verified === this.showVerified;
      });
    }

    // Resto del código de ordenamiento...
    if (this.orderBy) {
      this.participantsFilter.sort((a, b) => {
        // Utilizamos type assertion para informar a TypeScript sobre el tipo de las propiedades
        let valueA: string | number | boolean =
          a[this.orderBy as keyof participantToValidateI];
        let valueB: string | number | boolean =
          b[this.orderBy as keyof participantToValidateI];

        if (!(this.orderBy in a) || !(this.orderBy in b)) {
          return 0;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          // Si los valores son cadenas, ordenar alfabéticamente
          return this.orderDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          // De lo contrario, ordenar numéricamente
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
