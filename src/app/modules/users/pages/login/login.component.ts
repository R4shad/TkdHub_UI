import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLogin: string = 'trainer';
  email: string = '';
  password: string = '';
  constructor() {}

  ngOnInit(): void {}

  selectUser(user: string): void {
    this.userLogin = user;
  }

  login() {}
}
