import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root',
})
export class FriendRequestsService {
    constructor(
        private httpClient: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    baseUrl = 'http://localhost:8000/friend-requests';

    getFriendRequests(): Observable<any> {
        const url = `${this.baseUrl}/friend-requests`;

        return this.httpClient.get(url, { withCredentials: true }).pipe(
            tap((response: any) => {
                response.forEach((request: any) => {
                    request.from.profilePicture =
                        this.authService.getProfilePictureUrl(request.from.id);
                });
                return response;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }
    respondFriendRequest(
        friendRequestId: string,
        status: 'accept' | 'decline'
    ): Observable<any> {
        const url = `${this.baseUrl}/friend-request`;

        const body = { friendRequestId, status };

        return this.httpClient.put(url, body, { withCredentials: true }).pipe(
            tap((response: any) => {
                return response;
            }),
            catchError((error) => {
                return throwError(() => error);
            })
        );
    }
}
