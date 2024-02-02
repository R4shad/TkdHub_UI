import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  token = localStorage.getItem('token');
  constructor(private router: Router) {}
  nombreCampeonato: String = 'Campeonato clausura 2023';
  ngOnInit(): void {}

  logOut() {
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigate(['/']);
  }
}
