import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { clubI, responseClubI } from 'src/app/shared/models/Club';
import { switchMap } from 'rxjs/operators';
import { responseCoachI } from 'src/app/shared/models/Coach';

@Component({
  selector: 'app-trainer-registration',
  templateUrl: './trainer-registration.component.html',
  styleUrls: ['./trainer-registration.component.scss'],
})
export class TrainerRegistrationComponent implements OnInit {
  championshipId: number = 1;

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
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
    ]),
    codigoClub: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(3),
    ]),
    clubCoach: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(40),
    ]),
    clubCoachCi: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(8),
    ]),
  });

  get nombre() {
    return this.clubForm.get('nombre');
  }

  get codigoClub() {
    return this.clubForm.get('codigoClub');
  }

  get clubCoach() {
    return this.clubForm.get('clubCoach');
  }

  get clubCoachCi() {
    return this.clubForm.get('clubCoachCi');
  }

  send() {
    var newClub: clubI = this.clubForm.value;
    this.api
      .postClub(newClub, this.championshipId)
      .subscribe((response: responseClubI) => {
        if (response.status == 200) {
          this.api
            .postCoach(newClub, this.championshipId)
            .subscribe((response: responseCoachI) => {
              if (response.status == 200) {
                alert('Club creado correctamente');
              }
            });
        }
      });
  }
}
