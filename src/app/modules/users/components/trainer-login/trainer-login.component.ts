import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { AuthService } from '../../../../core/services/auth.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-trainer-login',
  templateUrl: './trainer-login.component.html',
  styleUrls: ['./trainer-login.component.scss'],
})
export class TrainerLoginComponent implements OnInit {
  championship!: ChampionshipI;
  coachCi: number = 0;
  password: string = '';
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
          const championshipId: number = Number(params.get('championshipId'));
          return this.api.getChampionshipInfo(championshipId);
        })
      )
      .subscribe((data) => {
        this.championship = data;
        console.log(this.championship);
      });
  }
  login(): void {
    this.api
      .getTrainerToken(
        this.championship.championshipId,
        this.coachCi,
        this.password
      )
      .subscribe((tokenData: any) => {
        this.api.getClubCode(this.coachCi).subscribe((clubCode: string) => {
          this.authService.setAuthenticated(true, tokenData.token);
          this.router.navigate([
            'championship/' +
              this.championship.championshipId +
              '/Coach/' +
              clubCode,
          ]);
          localStorage.setItem('token', tokenData.token);
        });
      });
  }
}
