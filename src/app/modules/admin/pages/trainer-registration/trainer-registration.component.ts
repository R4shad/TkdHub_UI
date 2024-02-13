import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { clubI, responseClubI } from 'src/app/shared/models/Club';
import { responseCoachI } from 'src/app/shared/models/Coach';

import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ChampionshipI } from 'src/app/shared/models/Championship';

@Component({
  selector: 'app-trainer-registration',
  templateUrl: './trainer-registration.component.html',
  styleUrls: ['./trainer-registration.component.scss'],
})
export class TrainerRegistrationComponent implements OnInit {
  championshipId: number = 0;
  championship!: ChampionshipI;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.championshipId = Number(params.get('championshipId'));
          return this.api.getChampionshipInfo(this.championshipId);
        })
      )
      .subscribe((championshipInfo) => {
        // Puedes realizar acciones adicionales si es necesario con championshipInfo
      });
  }

  inputLength = function (input: any): boolean {
    return (
      input.errors?.['minLength'] == null || input.errors?.['maxLength'] == null
    );
  };

  clubForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    clubCode: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3),
    ]),
    coachName: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(40),
    ]),
    coachCi: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(8),
    ]),
  });

  get name() {
    return this.clubForm.get('name');
  }

  get clubCode() {
    return this.clubForm.get('clubCode');
  }

  get coachName() {
    return this.clubForm.get('coachName');
  }

  get coachCi() {
    return this.clubForm.get('coachCi');
  }

  send() {
    let info = this.clubForm.value;
    var newClub: clubI = {
      name: info.name,
      clubCode: info.clubCode,
      coach: {
        name: info.coachName,
        coachCi: info.coachCi,
        clubCode: info.clubCode,
      },
    };
    console.log(newClub);
    this.api
      .postClub(newClub, this.championshipId)
      .subscribe((response: responseClubI) => {
        if (response.status == 201) {
          console.log('entre 201');
          this.api
            .postCoach(newClub, this.championshipId)
            .subscribe((response: responseCoachI) => {
              if (response.status == 201) {
                alert('Club creado correctamente');
              }
            });
        }
      });
  }

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }
}
