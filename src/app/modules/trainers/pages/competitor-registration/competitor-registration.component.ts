import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import {
  participantI,
  responseParticipantI,
} from './../../../../shared/models/participant';

@Component({
  selector: 'app-competitor-registration',
  templateUrl: './competitor-registration.component.html',
  styleUrls: ['./competitor-registration.component.scss'],
})
export class CompetitorRegistrationComponent implements OnInit {
  championshipId: number = 1;
  clubCode: string = '';
  championship!: ChampionshipI;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });

    this.route.paramMap.subscribe((params) => {
      this.clubCode = params.get('clubCode')!;
    });
  }

  defaultGrado = '*Elige el grade*';
  defaultSexo = '*Elige el gender*';
  inputLength = function (input: any): boolean {
    return (
      input.errors?.['minLength'] == null || input.errors?.['maxLength'] == null
    );
  };
  inscritoForm = new FormGroup({
    participantCi: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
    ]),
    firstNames: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    lastNames: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
    ]),
    weight: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3),
    ]),
    grade: new FormControl('*Elige el grade*', Validators.required),
    gender: new FormControl('*Elige el gender*', Validators.required),
  });

  get participantCi() {
    return this.inscritoForm.get('participantCi');
  }
  get firstNames() {
    return this.inscritoForm.get('firstNames');
  }

  get lastNames() {
    return this.inscritoForm.get('lastNames');
  }

  get age() {
    return this.inscritoForm.get('age');
  }

  get weight() {
    return this.inscritoForm.get('weight');
  }

  get grade() {
    return this.inscritoForm.get('grade');
  }

  get gender() {
    return this.inscritoForm.get('gender');
  }

  send() {
    var newParticipant: participantI = this.inscritoForm.value;
    newParticipant.clubCode = this.clubCode;
    console.log(newParticipant);
    console.log(this.championshipId);
    this.api
      .postParticipant(newParticipant, this.championshipId)
      .subscribe((response: responseParticipantI) => {
        if (response.status == 200) {
          alert('Inscrito agregado correctamente');
        }
      });
  }
}
