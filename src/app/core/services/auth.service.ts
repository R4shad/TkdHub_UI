import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  setAuthenticated(value: boolean, data: string): void {
    this.isAuthenticatedSubject.next(value);
    if (data != 'null') {
      localStorage.setItem('token', data);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setAuthenticated(false, 'null');
  }
}
