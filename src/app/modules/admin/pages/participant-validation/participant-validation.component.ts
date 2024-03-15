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
import { FormControl } from '@angular/forms';
import {
  obtenerValorNumerico,
  getCompetitoryCategoryId,
  getCompetitorAgeIntervalId,
  getCompetitorDivisionId,
} from './../../utils/participantValidation.utils';
import {
  isParticipantWithinWeightRange,
  isDivisionWithinAgeInterval,
} from '../../utils/validation.utils';
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

  filtroClub = new FormControl('Todos');
  filtroSexo = new FormControl('Todos');
  filtroPeso = new FormControl('Todos');
  filtroEdad = new FormControl('Todos');
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

  displayParticipants() {
    this.api.getParticipantsToVerify(this.championshipId).subscribe((data) => {
      this.participants = data;
      this.participantsFilter = data;
    });
    this.getData();
  }

  getData() {
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
        this.api
          .postCompetitor(newCompetitor, this.championshipId)
          .subscribe((response: responseCompetitorI) => {
            if (response.status == 201) {
              //alert('Verificado Correctamente');
              participant.verified = true;

              this.api
                .incrementCategoryAndDivision(
                  this.championshipId,
                  competitorDivisionId,
                  competitorCategoryId
                )
                .subscribe((response: responseI[]) => {});
            }
          });
      });
  }

  verificateAll() {
    this.participants.forEach((participant) => {
      this.verificateParticipant(participant);
    });
  }

  filter() {
    const genderFilter = this.filtroSexo.value;
    const clubFilter = this.filtroClub.value;
    const ageFilter = this.filtroEdad.value;
    const weightFilter = this.filtroPeso.value;

    const ageFilterNumber = parseInt(ageFilter, 10);
    const intervalEncontrado = this.ageIntervals.find(
      (interval) => interval.ageIntervalId === ageFilterNumber
    );
    if (
      genderFilter === 'Todos' &&
      clubFilter === 'Todos' &&
      ageFilter === 'Todos' &&
      weightFilter === 'Todos'
    ) {
      this.participantsFilter = this.participants;
    } else {
      this.participantsFilter = this.participants.filter((participant) => {
        let passesGenderFilter =
          genderFilter === 'Todos' || participant.gender === genderFilter;
        let passesClubFilter =
          clubFilter === 'Todos' || participant.clubCode === clubFilter;
        let passesAgeFilter =
          ageFilter === 'Todos' ||
          (participant.age >= intervalEncontrado!.minAge &&
            participant.age <= intervalEncontrado!.maxAge);
        let passesWeightFilter =
          weightFilter === 'Todos' ||
          isParticipantWithinWeightRange(participant, weightFilter);

        return (
          passesGenderFilter &&
          passesClubFilter &&
          passesAgeFilter &&
          passesWeightFilter
        );
      });

      // Filtrar las divisiones basadas en el ageIntervalId seleccionado
      this.divisionsFilter = this.divisions.filter((division) => {
        return division.ageIntervalId === intervalEncontrado!.ageIntervalId;
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
