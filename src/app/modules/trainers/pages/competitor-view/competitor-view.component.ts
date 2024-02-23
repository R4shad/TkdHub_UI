import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  participantI,
  participantToCreateI,
  participantToEditI,
  responseParticipantI,
  responseParticipantToCreateI,
  responseParticipantToEditI,
} from 'src/app/shared/models/participant';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';

interface ParticipantEI extends participantI {
  isEdit: boolean;
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
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.route.paramMap.subscribe((params) => {
      this.clubCode = params.get('clubCode')!;
    });

    this.displayParticipants();
  }
  goToParticipantRegistration() {
    const currentRoute = this.route.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'ParticipantRegistration']);
  }
  displayParticipants() {
    this.api
      .getParticipantsClub(this.championshipId, this.clubCode)
      .subscribe((data: participantI[]) => {
        // Asegúrate de tipar correctamente los datos recibidos
        const participantsWithEditFlag = data.map((participant) => ({
          ...participant,
          isEdit: false,
        }));
        this.participants = participantsWithEditFlag;
        this.participantsFilter = participantsWithEditFlag;
      });
  }
  filter() {
    const genderFilter = this.filtroSexo.value;
    if (genderFilter === 'todos') {
      this.participantsFilter = this.participants;
    } else {
      // Filtrar inscritos por sexo
      this.participantsFilter = this.participants.filter(
        (participant) => participant.gender === genderFilter
      );
    }
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
}
