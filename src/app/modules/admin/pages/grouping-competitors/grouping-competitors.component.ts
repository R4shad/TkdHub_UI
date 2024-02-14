import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { participantI } from 'src/app/shared/models/participant';
import { FormControl } from '@angular/forms';
import { clubI } from 'src/app/shared/models/Club';

@Component({
  selector: 'app-grouping-competitors',
  templateUrl: './grouping-competitors.component.html',
  styleUrls: ['./grouping-competitors.component.scss'],
})
export class GroupingCompetitorsComponent implements OnInit {
  participants: participantI[] = [];
  clubs: clubI[] = [];
  participantsFilter: participantI[] = [];
  genterFilter = new FormControl('');
  clubFilter = new FormControl('');
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
    this.getClubs();
    this.displayParticipants();
  }

  getCurrentRoute(): string {
    return this.route.snapshot.url.map((segment) => segment.path).join('/');
  }

  goToTraineeRegistration() {
    const currentRoute = this.getCurrentRoute();

    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'TraineeRegistration']);
  }

  goToChampionshipConfiguration() {
    const currentRoute = this.getCurrentRoute();

    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'ChampionshipConfiguration']);
  }

  goToParticipantValidation() {
    const currentRoute = this.getCurrentRoute();

    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'ParticipantValidation']);
  }

  goToCompetitorsGrouping() {
    const currentRoute = this.getCurrentRoute();

    // Navega a la ruta actual con '/TraineeRegistration' agregado
    this.router.navigate([currentRoute, 'Grouping']);
  }

  displayParticipants() {
    this.api.getParticipants(this.championshipId).subscribe((data) => {
      console.log(data);
      this.participants = data;
      this.participantsFilter = data;
    });
  }

  getClubs() {
    console.log(this.championshipId);
    this.api.getClubs(this.championshipId).subscribe((data) => {
      this.clubs = data;
    });
  }

  filterGender() {
    const genderFilter = this.genterFilter.value;
    console.log(genderFilter);
    if (genderFilter === 'todos') {
      this.participantsFilter = this.participants;
    } else {
      // Filtrar inscritos por sexo
      this.participantsFilter = this.participants.filter(
        (participant) => participant.gender === genderFilter
      );
    }
  }

  filterClub() {
    const clubFilter = this.clubFilter.value;
    console.log(clubFilter);
    if (clubFilter === 'todos') {
      this.participantsFilter = this.participants;
    } else {
      // Filtrar inscritos por sexo
      this.participantsFilter = this.participants.filter(
        (participant) => participant.clubCode === clubFilter
      );
    }
  }
}
