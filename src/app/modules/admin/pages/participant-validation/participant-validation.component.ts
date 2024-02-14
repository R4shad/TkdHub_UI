import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantToValidateI } from 'src/app/shared/models/participant';
@Component({
  selector: 'app-participant-validation',
  templateUrl: './participant-validation.component.html',
  styleUrls: ['./participant-validation.component.scss'],
})
export class ParticipantValidationComponent implements OnInit {
  championshipId: number = 0;
  participants: participantToValidateI[] = [];
  participantsFilter: participantToValidateI[] = [];
  verifiedParticipants: participantToValidateI[] = [];
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
      console.log(data);
      this.participants = data;
      this.participantsFilter = data;
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

  isParticipantVerified(participant: participantToValidateI): boolean {
    return this.verifiedParticipants.some(
      (p) => p.participantCi === participant.participantCi
    );
  }
}
