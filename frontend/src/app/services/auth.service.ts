import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authUrl = `${environment.baseUrl}/auth`;
    userUrl = `${environment.baseUrl}/user`;

    user$: User = {
        id: '',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    };
    constructor(private httpClient: HttpClient, private router: Router) {}

    public checkLoginStatus(): boolean {
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
        const url = `${this.authUrl}/register`;
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
        const url = `${this.authUrl}/activate/${uidb64}/${token}`;
        return this.httpClient.post(url, {});
    }

    login(loginData: User): Observable<any> {
        const url = `${this.authUrl}/login`;
        return this.httpClient
            .post(url, loginData, { withCredentials: true })
            .pipe(
                tap((response: any) => {
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
        const url = `${this.userUrl}/details`;
        return this.httpClient.get(url, { withCredentials: true }).pipe(
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
        const url = `${this.userUrl}/${userId}`;
        const headers = {
            'Content-Type': 'application/json',
            token: `${this.getAuthTokenFromLocalStorage()}`,
        };

        return this.httpClient.get(url, { headers });
    }
    getProfilePictureUrl(userId: string): string {
        return `${this.userUrl}/uploads/${userId}`;
    }
    getUserId(): string {
        this.getUser();
        return this.user$.id;
    }
}
