import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { switchMap } from 'rxjs/operators';
import { ChampionshipI } from 'src/app/shared/models/Championship';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  championship!: ChampionshipI;
  userLogin: string = 'trainer';
  email: string = '';
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

  selectUser(user: string): void {
    this.userLogin = user;
  }

  login(): void {
    this.api
      .getOrganizerToken(
        this.championship.championshipId,
        this.email,
        this.password
      )
      .subscribe((data) => {
        console.log(data);
        this.authService.setAuthenticated(true, data.token);
        this.router.navigate([
          'championship/' + this.championship.championshipId + '/Organizer',
        ]);
        localStorage.setItem('token', data.token);
      });
  }
}
