// header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  token?: string | null;

  constructor(private authService: AuthService, private router: Router) {}

  nombreCampeonato: string = 'Campeonato clausura 2023';

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.token = this.authService.getToken();
      } else {
        this.token = null;
      }
    });
  }

  logOut(): void {
    this.authService.logout();
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigate(['/']);
  }
}
