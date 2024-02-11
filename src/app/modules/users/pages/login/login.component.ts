import { Component, OnInit } from '@angular/core';
import { OrganizerLoginComponent } from '../../components/organizer-login/organizer-login.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLogin: string = 'trainer';
  constructor() {}

  ngOnInit(): void {}

  selectUser(user: string): void {
    this.userLogin = user;
  }
}
