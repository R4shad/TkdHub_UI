import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  private tokenKey = 'token';

  setAuthenticated(value: boolean, token: string | null): void {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticatedSubject.next(value);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    this.setAuthenticated(false, null);
  }
}
