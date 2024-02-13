import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authUrl = `${environment.baseUrl}/auth`;
    userUrl = `${environment.baseUrl}/user`;

    private userSubject = new BehaviorSubject<User>({
        id: '',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    });
    user$ = this.userSubject.asObservable();

    constructor(private httpClient: HttpClient, private router: Router) {}

    public checkLoginStatus(): Observable<any> {
        return this.httpClient
            .get(`${this.authUrl}/check-login`, {
                withCredentials: true,
            })
            .pipe(
                tap((response: any) => {
                    this.userSubject.next(response);
                    return response;
                }),
                catchError((error: any) => {
                    return throwError(() => error);
                })
            );
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
                    return response;
                }),
                catchError((error) => {
                    return throwError(() => error);
                })
            );
    }

    getUser(): Observable<any> {
        // const url = `${this.userUrl}/details`;
        // return this.httpClient.get(url, { withCredentials: true }).pipe(
        //     tap((response: any) => {
        //         this.user$ = response;
        //         return response;
        //     }),
        //     catchError((error) => {
        //         return throwError(() => error);
        //     })
        // );
        return this.user$;
    }

    getUserName(userId: string): Observable<any> {
        const url = `${this.userUrl}/${userId}`;

        return this.httpClient.get(url, { withCredentials: true });
    }
    getProfilePictureUrl(userId: string): string {
        return `${this.userUrl}/uploads/${userId}`;
    }
    getUserId(): string {
        const user = this.userSubject.value;
        return user.id ? user.id : '';
    }
}
