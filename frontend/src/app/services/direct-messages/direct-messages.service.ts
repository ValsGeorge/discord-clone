import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../../models/user';
import { DmList } from 'src/app/models/dmList';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DirectMessagesService {
    constructor(private authService: AuthService, private http: HttpClient) {}

    private userListSubject = new Subject<DmList[]>();
    userList$ = this.userListSubject.asObservable();

    baseUrl = 'http://localhost:8000/dm-list';

    getDMList(): Observable<DmList[]> {
        const url = `${this.baseUrl}/`;

        return this.http.get<DmList[]>(url, { withCredentials: true }).pipe(
            tap((response) => {
                console.log('DM List:', response);
            }),
            catchError((error) => {
                console.error('Error fetching DM list:', error);
                throw error;
            })
        );
    }

    addUserToDMList(userId: string): void {
        const url = `${this.baseUrl}/`;

        console.log('userId', userId);

        const body = {
            me: this.authService.getUserId(),
            user: userId,
        };

        console.log('body', body);

        this.http.post(url, body, { withCredentials: true }).subscribe(
            (response: any) => {
                const dmUserId = response['user']['id'];
                // const user = this.authService.getUserName(dmUserId).subscribe(
                //     (user) => {
                //         this.userListSubject.next(user);
                //     },
                //     (error) => {
                //         console.error('Error adding user to DM list:', error);
                //     }
                // );
                this.userListSubject.next(response);
            },
            (error) => {
                console.error('Error adding user to DM list:', error);
            }
        );
    }

    removeUserFromDMList(dmListId: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/${dmListId}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.http.delete(url, { withCredentials: true });
    }
}
