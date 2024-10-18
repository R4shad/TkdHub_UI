import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.hasToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    const segments = state.url.split('/');
    const roleIndex = segments.indexOf('Championship') + 2;
    const currentUserRole = segments[roleIndex] as string;
    const expectedRoles: string[] = route.data['expectedRoles'];

    if (expectedRoles.includes(currentUserRole)) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}
