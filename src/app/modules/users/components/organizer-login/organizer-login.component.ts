import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChampionshipI } from 'src/app/shared/models/Championship';
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Suscríbete a los cambios en los parámetros de la ruta
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          // Obtén el championshipId del parámetro de la ruta
          const championshipId: number = Number(params.get('championshipId'));

          // Utiliza championshipId para hacer la solicitud al servicio
          return this.api.getChampionshipInfo(championshipId);
        })
      )
      .subscribe((data) => {
        this.championship = data;
        console.log(this.championship);
      });
  }

  login(): void {
    // Aquí puedes realizar las operaciones de inicio de sesión utilizando this.username y this.password
    console.log('Nombre de usuario:', this.username);
    console.log('Contraseña:', this.password);

    this.api
      .getOrganizerToken(
        this.championship.championshipId,
        this.username,
        this.password
      )
      .subscribe((data) => {
        console.log(data);
        //this.championships = data;
        //console.log(this.championships);
      });
  }
}
