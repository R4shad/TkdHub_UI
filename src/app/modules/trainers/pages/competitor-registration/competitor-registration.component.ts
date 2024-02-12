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
      .subscribe((championshipInfo) => {});
  }

  defaultGrado = '*Elige el grado*';
  defaultSexo = '*Elige el sexo*';
  inputLength = function (input: any): boolean {
    return (
      input.errors?.['minLength'] == null || input.errors?.['maxLength'] == null
    );
  };
  inscritoForm = new FormGroup({
    inscritoCi: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(8),
    ]),
    nombres: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    apellidos: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    edad: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
    ]),
    peso: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3),
    ]),
    grado: new FormControl('*Elige el grado*', Validators.required),
    sexo: new FormControl('*Elige el sexo*', Validators.required),
  });

  get inscritoCi() {
    return this.inscritoForm.get('inscritoCi');
  }
  get nombres() {
    return this.inscritoForm.get('nombres');
  }

  get apellidos() {
    return this.inscritoForm.get('apellidos');
  }

  get edad() {
    return this.inscritoForm.get('edad');
  }

  get peso() {
    return this.inscritoForm.get('peso');
  }

  get grado() {
    return this.inscritoForm.get('grado');
  }

  get sexo() {
    return this.inscritoForm.get('sexo');
  }

  send() {
    //var nuevoInscrito: inscritoI = this.inscritoForm.value;
    //nuevoInscrito.codigoClub = 'LIN';
    //console.log(nuevoInscrito);
    //this.api.postInscrito(nuevoInscrito).subscribe((response: ResponseI) => {
    //  if (response.status == 200) {
    //    alert('Inscrito agregado correctamente');
    //  }
    //});
  }
}
