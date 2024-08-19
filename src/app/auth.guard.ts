import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service'; // Importa tu servicio de autenticación aquí

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {} // Inyecta el AuthService y el Router

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Comprueba si el usuario está autenticado
    let isAuthenticated: boolean = true; //false
    this.authService.isAuthenticated$.subscribe((authenticated) => {
      isAuthenticated = authenticated;
      if (!isAuthenticated) {
        //this.router.navigate(['/login']); // Cambia '/login' por la ruta de tu página de inicio de sesión
      }
    });

    if (!isAuthenticated) {
      return true; //false
    }

    // Obtiene el rol del usuario desde la ruta
    const segments = state.url.split('/');
    const roleIndex = segments.indexOf('Championship') + 2; // El índice del rol es dos segmentos después de 'championshipId'
    const currentUserRole = segments[roleIndex] as string; // Asegúrate de que se interprete como una cadena

    // Comprueba el tipo de usuario
    const expectedRoles: string[] = route.data['expectedRoles']; // Accede a la propiedad utilizando ["expectedRoles"]
    if (expectedRoles.includes(currentUserRole)) {
      return true; // Si el tipo de usuario actual está autorizado, permite el acceso a la ruta
    } else {
      // Si el tipo de usuario actual no está autorizado, redirige a una página de acceso denegado y retorna false
      this.router.navigate(['/access-denied']); // Cambia '/access-denied' por la ruta de la página de acceso denegado
      return true; //false
    }
  }
}
