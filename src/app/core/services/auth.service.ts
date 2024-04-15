import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  setAuthenticated(value: boolean, token: string | null): void {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.isAuthenticatedSubject.next(value);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    this.setAuthenticated(false, null);
  }
}
