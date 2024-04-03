import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import {
  responsibleI,
  responseResponsibleI,
  responsiblePI,
  responsibleEditI,
} from 'src/app/shared/models/responsible';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipI } from 'src/app/shared/models/Championship';

interface responsibleEI extends responsibleI {
  isEdit: boolean;
}

@Component({
  selector: 'app-responsible-registration',
  templateUrl: './responsible-registration.component.html',
  styleUrls: ['./responsible-registration.component.scss'],
})
export class ResponsibleRegistrationComponent implements OnInit {
  responsibles: responsibleEI[] = [];
  championship!: ChampionshipI;
  championshipId: number = 0;
  modalRef?: NgbModalRef | undefined;
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
    this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
      this.championship = data;
    });
    this.displayResponsibles();
  }

  displayResponsibles() {
    this.api.getResponsibles(this.championshipId).subscribe((data) => {
      const responsiblesWithEditFlag = data.map((responsible) => ({
        ...responsible,
        isEdit: false,
      }));
      this.responsibles = responsiblesWithEditFlag;
    });
    console.log(this.responsibles);
  }

  onEdit(responsible: responsibleEI) {
    this.responsibles.forEach((responsible) => {
      responsible.isEdit = false;
    });
    responsible.isEdit = true;
  }

  cancelEdit(responsible: responsibleEI) {
    responsible.isEdit = false;
  }

  addResponsible() {
    const newResponsible: responsiblePI = {
      name: '',
      email: '',
      password: '',
    };
    console.log(newResponsible);
    this.api
      .postResponsible(this.championshipId, newResponsible)
      .subscribe((response: responseResponsibleI) => {
        console.log(response.status);
        if (response.status == 201) {
          const newResponsibleEditable: responsibleEI = {
            responsibleId: response.data.responsibleId,
            name: newResponsible.name,
            email: newResponsible.email,
            isEdit: true,
          };
          this.responsibles.unshift(newResponsibleEditable);
          alert('Creado correctamente');
        }
      });
  }

  confirmEdit(responsible: responsibleEI) {
    const newResponsible: responsibleEditI = {
      id: responsible.responsibleId,
      name: responsible.name,
      email: responsible.email,
    };
    this.api
      .editResponsible(
        this.championshipId,
        responsible.responsibleId,
        newResponsible
      )
      .subscribe((response: responseResponsibleI) => {
        if (response.status == 200) {
          alert('Editado correctamente');
          responsible.isEdit = false;
        }
      });
  }

  onDelete(responsible: responsibleEI) {
    console.log(responsible);
    const confirmation = window.confirm(
      '¿Estás seguro que quieres eliminar este participante?'
    );
    if (confirmation) {
      this.api
        .deleteResponsible(this.championshipId, responsible.responsibleId)
        .subscribe((response: responseResponsibleI) => {
          if (response.status == 200) {
            this.responsibles = this.responsibles.filter(
              (c) => c !== responsible
            );
            alert('Eliminado correctamente');
          }
        });
    }
  }

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }

  confirm() {
    if (this.modalRef) {
      // Verifica si modalRef está definido
      this.api
        .updateChampionshipStage(this.championshipId)
        .subscribe((data) => {
          if (data === 200) {
            this.api
              .updateChampionshipStage(this.championshipId)
              .subscribe((data) => {
                if (data === 200) {
                  if (this.modalRef != undefined) {
                    this.modalRef.close();
                  }
                  this.router.navigate([
                    '/championship',
                    this.championshipId,
                    'Organizer',
                  ]);
                }
              });
          }
        });
    } else {
      console.warn('modalRef no está definido'); // Muestra una advertencia si modalRef no está definido
    }
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }
}
