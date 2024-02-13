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
import { UtilsService } from '../services/utils.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    authenticated = false;
    constructor(
        private authService: AuthService,
        private router: Router,
        private utilsService: UtilsService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authenticated) {
            return true;
        } else {
            return this.authService.checkLoginStatus().pipe(
                map((response: any) => {
                    if (response) {
                        // Setup socket connection
                        this.utilsService.setupSocketConnection();
                        this.authenticated = true;
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
}
