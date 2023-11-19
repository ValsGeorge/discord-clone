import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { Observable, catchError, tap, throwError } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = 'http://localhost:8000/users';

    user$: User = {
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
    constructor(private httpClient: HttpClient, private router: Router) {}

    private checkLoginStatus(): boolean {
        const token = this.getAuthTokenFromLocalStorage();
        return !!token;
    }

    private getAuthTokenFromLocalStorage(): string | null {
        return localStorage.getItem('token');
    }

    private setAuthTokenInLocalStorage(token: string): void {
        localStorage.setItem('token', token);
    }

    private clearLocalStorage(): void {
        localStorage.clear();
    }

    register(userData: User) {
        const url = `${this.baseUrl}/register`;
        const headers = {
            'Content-Type': 'application/json',
        };
        const body = JSON.stringify(userData);
        return this.httpClient.post(url, body, { headers }).pipe(
            (response: any) => {
                return response;
            },
            (error: any) => {
                return error;
            }
        );
    }

    activateAccount(uidb64: string, token: string): Observable<any> {
        const url = `${this.baseUrl}/activate/${uidb64}/${token}`;
        return this.httpClient.post(url, {});
    }

    login(loginData: User): Observable<any> {
        const url = `${this.baseUrl}/login`;
        return this.httpClient.post(url, loginData).pipe(
            tap((response: any) => {
                console.log('response: ', response);
                const token = response.token;
                this.setAuthTokenInLocalStorage(token);
                return response;
            }),
            catchError((error) => {
                this.clearLocalStorage();
                return throwError(() => error);
            })
        );
    }

    getUser(): Observable<any> {
        const url = `${this.baseUrl}/details`;
        const headers = {
            'Content-Type': 'application/json',
            token: `${this.getAuthTokenFromLocalStorage()}`,
        };
        return this.httpClient.get(url, { headers }).pipe(
            tap((response: any) => {
                this.user$ = response;
                return response;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    getUserName(userId: string): Observable<any> {
        const url = `${this.baseUrl}/details/${userId}`;
        const headers = {
            'Content-Type': 'application/json',
            token: `${this.getAuthTokenFromLocalStorage()}`,
        };

        return this.httpClient.get(url, { headers });
    }
}
