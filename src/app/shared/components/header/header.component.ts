// header.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { ChampionshipI } from '../../models/Championship';
import { ChampionshipStage } from '../../models/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  token: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private api: ApiService,
    private route: ActivatedRoute
  ) {}

  championshipId: number = 0;
  championship: ChampionshipI = {
    championshipId: 0,
    championshipName: '',
    stage: ChampionshipStage.Etapa1,
    championshipDate: '',
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = this.getChampionshipIdFromUrl();
      if (this.championshipId != 0) {
        this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
          this.championship = data;
        });
      }
      console.log(this.championshipId);
    });

    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.token = this.authService.getToken();
      } else {
        this.token = null;
      }
      console.log(this.token);
    });
  }

  getChampionshipIdFromUrl(): number {
    const urlParts = window.location.href.split('/');
    const championshipIdIndex = urlParts.indexOf('championship');
    if (
      championshipIdIndex !== -1 &&
      urlParts.length > championshipIdIndex + 1
    ) {
      const championshipId = parseInt(urlParts[championshipIdIndex + 1], 10);
      return championshipId;
    }
    return 0;
  }

  logOut(): void {
    this.authService.logout();
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigate(['/']);
  }

  goBack() {
    const championshipId = this.championship.championshipId;
    this.router.navigate(['/championship', championshipId, 'Organizer']);
  }

  goToLogin() {
    const championshipId = this.championship.championshipId;
    this.router.navigate(['/championship', championshipId, 'login']);
  }

  inLogin(): boolean {
    const urlParts = window.location.href.split('/');
    const championshipIdIndex = urlParts.indexOf('championship');
    if (
      championshipIdIndex !== -1 &&
      urlParts.length > championshipIdIndex + 2 &&
      urlParts[championshipIdIndex + 2] === 'login'
    ) {
      return true;
    }
    return false;
  }

  isOrganizer(): boolean {
    const urlParts = window.location.href.split('/');
    const championshipIdIndex = urlParts.indexOf('championship');
    if (
      championshipIdIndex !== -1 &&
      urlParts.length > championshipIdIndex + 2 &&
      urlParts[championshipIdIndex + 2] === 'Organizer'
    ) {
      return true;
    }
    return false;
  }
}
