/* import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service'

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthServiceService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.getUser();

    if (isAuthenticated) {
      this.router.navigateByUrl('/dashboard');
      return false;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
} */
  import { inject } from '@angular/core';
  import { CanActivateFn, Router } from '@angular/router';
  import { AuthServiceService } from '../services/auth-service.service'; // Asegúrate de que la ruta es correcta
  import { map } from 'rxjs/operators';
  
  export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthServiceService);
    const router = inject(Router);
  
    return authService.getUser().pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          router.navigate(['login']);
          return false;
        }
      })
    );
  };