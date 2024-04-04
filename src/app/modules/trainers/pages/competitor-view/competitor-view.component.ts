import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  participantI,
  participantToCreateI,
  participantToEditI,
  responseParticipantI,
  responseParticipantToEditI,
} from 'src/app/shared/models/participant';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import {
  categoryI,
  categoryWithNumericValueI,
} from 'src/app/shared/models/category';
import {
  obtenerValorNumerico,
  obtenerColor,
  getCompetitoryCategoryId,
  getCompetitoryCategoryName,
  getCompetitorAgeIntervalId,
  getCompetitorDivisionId,
} from 'src/app/modules/admin/utils/participantValidation.utils';
import { agesI } from 'src/app/shared/models/ages';
import { divisionI } from 'src/app/shared/models/division';

interface ParticipantEI extends participantI {
  isEdit: boolean;
  division: string | null; // Propiedad para almacenar el resultado de getCompetitorDivision()
  category: string | null;
}

@Component({
  selector: 'app-competitor-view',
  templateUrl: './competitor-view.component.html',
  styleUrls: ['./competitor-view.component.scss'],
})
export class CompetitorViewComponent implements OnInit {
  participants: ParticipantEI[] = [];
  participantsFilter: ParticipantEI[] = [];
  filtroSexo = new FormControl('');
  championshipId: number = 0;
  clubCode: string = '';

  categories: categoryI[] = [];
  categoriesWithNumericValue: categoryWithNumericValueI[] = [];

  ageIntervals: agesI[] = [];
  divisions: divisionI[] = [];

  validGrades: string[] = [];

  orderBy: string = '';
  orderDirection: 'asc' | 'desc' | 'normal' = 'normal';
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
    this.route.paramMap.subscribe((params) => {
      this.clubCode = params.get('clubCode')!;
    });

    this.api
      .getChampionshipCategories(this.championshipId)
      .subscribe((data) => {
        this.categories = data;
        this.validGrades = this.getValidGrades();

        for (const category of data) {
          this.categoriesWithNumericValue.push({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            gradeMin: obtenerValorNumerico(category.gradeMin),
            gradeMax: obtenerValorNumerico(category.gradeMax),
          });
        }
      });

    this.api
      .getParticipantsClub(this.championshipId, this.clubCode)
      .subscribe((data: participantI[]) => {
        // Asegúrate de tipar correctamente los datos recibidos
        const participantsWithEditFlag = data.map((participant) => ({
          ...participant,
          isEdit: false,
          division: null,
          category: null,
        }));
        this.participants = participantsWithEditFlag;
        this.participantsFilter = participantsWithEditFlag;
        for (const participant of this.participantsFilter) {
          this.getCompetitorDivision(participant);
          this.getCategory(participant);
        }
      });

    this.api
      .getChampionshipAgeInterval(this.championshipId)
      .subscribe((data) => {
        this.ageIntervals = data;
      });
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

  goToParticipantRegistration() {
    const currentRoute = this.route.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'ParticipantRegistration']);
  }

  onEdit(participant: ParticipantEI) {
    this.participants.forEach((participant) => {
      participant.isEdit = false;
    });
    participant.isEdit = true;
  }

  cancelEdit(participant: ParticipantEI) {
    participant.isEdit = false;
  }

  addParticipant() {
    const newParticipant: participantToCreateI = {
      clubCode: this.clubCode,
      firstNames: '',
      lastNames: '',
      age: 0,
      weight: 0,
      grade: '',
      gender: '',
    };

    this.api
      .postParticipant(newParticipant, this.championshipId)
      .subscribe((response: responseParticipantI) => {
        if (response.status == 201) {
          const newParticipantEditable: ParticipantEI = {
            id: response.data.id,
            clubCode: newParticipant.clubCode,
            firstNames: newParticipant.firstNames,
            lastNames: newParticipant.lastNames,
            age: newParticipant.age,
            weight: newParticipant.weight,
            grade: newParticipant.grade,
            gender: newParticipant.gender,
            isEdit: true,
            division: null,
            category: null,
          };

          this.participants.unshift(newParticipantEditable);
          alert('Creado correctamente');
        }
      });
  }

  confirmEdit(participant: ParticipantEI) {
    const newParticipant: participantToEditI = {
      lastNames: participant.lastNames,
      firstNames: participant.firstNames,
      age: participant.age,
      weight: participant.weight,
      grade: participant.grade,
      gender: participant.gender,
    };
    this.api
      .editParticipant(this.championshipId, participant.id, newParticipant)
      .subscribe((response: responseParticipantToEditI) => {
        if (response.status == 200) {
          alert('Editado correctamente');
          participant.isEdit = false;

          this.getCompetitorDivision(participant);
          this.getCategory(participant);
        }
      });
  }

  onDelete(participant: ParticipantEI) {
    const confirmation = window.confirm(
      '¿Estás seguro que quieres eliminar este participante?'
    );
    if (confirmation) {
      this.api
        .deleteParticipant(this.championshipId, participant.id)
        .subscribe((response: responseParticipantI) => {
          if (response.status == 200) {
            this.participants = this.participants.filter(
              (p) => p !== participant
            );
            this.participantsFilter = this.participantsFilter.filter(
              (p) => p !== participant
            );
            alert('Eliminado correctamente');
          }
        });
    }
  }

  getCompetitorDivision(participant: ParticipantEI): void {
    if (participant.division !== null) {
      return;
    }
    this.api
      .getAgeIntervalByAge(this.championshipId, participant.age)
      .subscribe((data1) => {
        if (data1) {
          // Verifica si hay datos en data1
          const ageId = data1.ageIntervalId; // Accede a la propiedad ageIntervalId
          // Realiza la llamada API para obtener la división dentro de esta suscripción
          this.api
            .getDivisionByData(
              this.championshipId,
              participant.gender,
              ageId,
              participant.weight
            )
            .subscribe((data) => {
              // Almacena el resultado en la propiedad division
              participant.division =
                '[' + data.minWeight + ' - ' + data.maxWeight + ']';
            });
        }
      });
  }

  getCategory(participant: ParticipantEI) {
    if (participant.category !== null) {
      return;
    }

    const gradoParticipante = obtenerValorNumerico(participant.grade);
    const categoryName: string = getCompetitoryCategoryName(
      this.categoriesWithNumericValue,
      gradoParticipante
    );
    participant.category = categoryName;
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
    if (this.orderBy) {
      this.participantsFilter.sort((a, b) => {
        let valueA: string | number | boolean | null =
          a[this.orderBy as keyof ParticipantEI];
        let valueB: string | number | boolean | null =
          b[this.orderBy as keyof ParticipantEI];

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
}
