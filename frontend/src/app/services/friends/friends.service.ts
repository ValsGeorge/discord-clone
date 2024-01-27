import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root',
})
export class FriendsService {
    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    baseUrl = 'http://localhost:8000/friends';

    getFriends(): Observable<any> {
        const url = `${this.baseUrl}`;

        return this.httpClient.get(url, { withCredentials: true }).pipe(
            tap((response: any) => {
                response.forEach((friend: any) => {
                    friend.friend.profilePicture =
                        this.authService.getProfilePictureUrl(friend.friend.id);
                });
                return response;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }
}
