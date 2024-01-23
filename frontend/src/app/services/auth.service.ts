import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    authUrl = 'http://localhost:8000/auth';
    userUrl = 'http://localhost:8000/user';

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

    addFriend(friendId: string): Observable<any> {
        const userId = this.getUserId();
        const url = `${this.userUrl}/friends`;
        const headers = {
            'Content-Type': 'application/json',
            token: `${this.getAuthTokenFromLocalStorage()}`,
        };
        const body = JSON.stringify({ userId, friendId });
        return this.httpClient.post(url, body, { headers });
    }

    getFriends(): Observable<any> {
        const url = `${this.userUrl}/friends`;
        const headers = {
            'Content-Type': 'application/json',
            token: `${this.getAuthTokenFromLocalStorage()}`,
        };
        return this.httpClient.get(url, { headers }).pipe(
            tap((response: any) => {
                response.forEach((friend: any) => {
                    friend.profilePicture = this.getProfilePictureUrl(
                        friend.id
                    );
                });
                return response;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    getFriendRequests(): Observable<any> {
        const url = `${this.userUrl}/friend-requests`;
        const headers = {
            'Content-Type': 'application/json',
            token: `${this.getAuthTokenFromLocalStorage()}`,
        };
        return this.httpClient.get(url, { headers }).pipe(
            tap((response: any) => {
                response.forEach((request: any) => {
                    request.profilePicture = this.getProfilePictureUrl(
                        request.id
                    );
                });
                return response;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }

    respondFriendRequest(
        userId: string,
        friendRequestId: string,
        status: 'accept' | 'decline'
    ): Observable<any> {
        const url = `${this.userUrl}/friend-request`;
        const headers = {
            'Content-Type': 'application/json',
            token: this.getAuthTokenFromLocalStorage() || '',
        };

        const body = { userId, friendRequestId, status };
        const options = {
            headers: new HttpHeaders(headers), // Use HttpHeaders to set headers correctly
        };

        return this.httpClient.put(url, body, options);
    }
}
