// auth.guard.ts
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        console.log('AuthGuard#canActivate called');
        return this.authService.checkLoginStatus().pipe(
            map((response: any) => {
                if (response) {
                    return true;
                }
                this.router.navigate(['/login']);
                return false;
            }),
            catchError((error: any) => {
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}
