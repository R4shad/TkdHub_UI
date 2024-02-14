import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantToValidateI } from 'src/app/shared/models/participant';
import { categoryI } from 'src/app/shared/models/category';
import { divisionI } from 'src/app/shared/models/division';
@Component({
  selector: 'app-participant-validation',
  templateUrl: './participant-validation.component.html',
  styleUrls: ['./participant-validation.component.scss'],
})
export class ParticipantValidationComponent implements OnInit {
  championshipId: number = 0;
  participants: participantToValidateI[] = [];
  participantsFilter: participantToValidateI[] = [];
  championshipCategories: categoryI[] = [];
  championshipDivisions: divisionI[] = [];
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
    console.log('AQUI');
    this.getApiCategories();
    this.getApiDivisions();
  }

  getApiDivisions() {
    this.api.getChampionshipDivisions(this.championshipId).subscribe((data) => {
      console.log(data);
      this.championshipDivisions = data;
    });
  }

  getApiCategories() {
    this.api
      .getChampionshipCategories(this.championshipId)
      .subscribe((data) => {
        console.log(data);
        this.championshipCategories = data;
      });
  }

  verificateParticipant(participant: participantToValidateI) {
    this.api
      .verifyParticipant(this.championshipId, participant.participantCi)
      .subscribe((data) => {
        console.log(data.message);
        // Actualizar el estado del participante a "Verificado"
        participant.verified = true;
      });
  }
}
