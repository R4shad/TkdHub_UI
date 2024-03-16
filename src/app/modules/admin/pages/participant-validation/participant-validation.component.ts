import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import {
  participantToEditI,
  participantToValidateI,
  responseParticipantToEditI,
} from 'src/app/shared/models/participant';
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
  obtenerColor,
} from './../../utils/participantValidation.utils';
import { isDivisionWithinAgeInterval } from '../../utils/validation.utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipI } from 'src/app/shared/models/Championship';

interface participantToValidateEI extends participantToValidateI {
  isEdit: boolean;
  //division: string | null; // Propiedad para almacenar el resultado de getCompetitorDivision()
  //category: string | null;
}

@Component({
  selector: 'app-participant-validation',
  templateUrl: './participant-validation.component.html',
  styleUrls: ['./participant-validation.component.scss'],
})
export class ParticipantValidationComponent implements OnInit {
  isEdit: boolean = false; // Indica si el participante está en modo de edición
  isVerified: boolean = false; // Indica si el participante está verificado
  modalRef?: NgbModalRef | undefined;
  championshipId: number = 0;
  championship!: ChampionshipI;

  participants: participantToValidateEI[] = [];
  participantsFilter: participantToValidateEI[] = [];

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
  validGrades: string[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
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
    this.api.getParticipantsToVerify(this.championshipId).subscribe((data) => {
      const participantsWithEditFlag = data.map((participant) => ({
        ...participant,
        isEdit: false,
      }));

      this.participants = participantsWithEditFlag;
      this.participantsFilter = participantsWithEditFlag;
      console.log(this.participantsFilter);
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
  }

  verificateParticipant(participant: participantToValidateEI) {
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
              participant.verified = true;
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

      // Aplicar filtro de texto
      this.participantsFilter = this.participantsFilter.filter(
        (participant) => {
          const nombres = participant.firstNames.toLowerCase();
          const apellidos = participant.lastNames.toLowerCase();
          const texto = this.textoFiltro.toLowerCase();
          return nombres.includes(texto) || apellidos.includes(texto);
        }
      );
    } else {
      // Si no hay filtro por verificación, aplicar solo filtro de texto
      this.participantsFilter = this.participants.filter((participant) => {
        const nombres = participant.firstNames.toLowerCase();
        const apellidos = participant.lastNames.toLowerCase();
        const texto = this.textoFiltro.toLowerCase();
        return nombres.includes(texto) || apellidos.includes(texto);
      });
    }

    if (this.orderBy) {
      this.participantsFilter.sort((a, b) => {
        let valueA: string | number | boolean =
          a[this.orderBy as keyof participantToValidateEI];
        let valueB: string | number | boolean =
          b[this.orderBy as keyof participantToValidateEI];

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

  onEdit(participant: participantToValidateEI) {
    if (!participant.isEdit) {
      participant.isEdit = true;
    }
  }

  confirmEdit(participant: participantToValidateEI) {
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

          //this.getCompetitorDivision(participant);
          //this.getCategory(participant);
        }
      });
  }

  cancelEdit(participant: participantToValidateEI) {
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
      console.warn('modalRef no está definido'); // Muestra una advertencia si modalRef no está definido
    }
  }
}
