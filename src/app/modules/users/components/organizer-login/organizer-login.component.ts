import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { AuthService } from '../../../../core/services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-organizer-login',
  templateUrl: './organizer-login.component.html',
  styleUrls: ['./organizer-login.component.scss'],
})
export class OrganizerLoginComponent implements OnInit {
  championship!: ChampionshipI;
  username: string = '';
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
    //console.log('Nombre de usuario:', this.username);
    //console.log('Contraseña:', this.password);

    this.api
      .getOrganizerToken(
        this.championship.championshipId,
        this.username,
        this.password
      )
      .subscribe((data) => {
        // console.log(data);
        this.authService.setAuthenticated(true, data.token);
        this.router.navigate([
          'championship/' + this.championship.championshipId + '/Organizer',
        ]);
        localStorage.setItem('token', data.token);
      });
  }
}
