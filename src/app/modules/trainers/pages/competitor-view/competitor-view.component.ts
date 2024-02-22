import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { participantI } from 'src/app/shared/models/participant';
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
  participants: participantI[] = [];
  participantsFilter: participantI[] = [];
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
      .subscribe((data) => {
        console.log(data);
        this.participants = data;
        this.participantsFilter = data;
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

  onEdit(participant: participantI) {}
}
