import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
    providedIn: 'root',
})
export class DirectMessagesService {
    constructor(private authService: AuthService, private http: HttpClient) {}

    private userListSubject = new Subject<User[]>();
    userList$ = this.userListSubject.asObservable();

    baseUrl = 'http://localhost:8000/dm-list';

    getDMList(): Observable<User> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.http.get(url, { headers }) as Observable<User>;
    }

    addUserToDMList(userId: string): void {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/add-user`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        const payload = {
            userId: this.authService.getUserId(),
            dmUserId: userId,
        };

        this.http.post(url, payload, { headers }).subscribe(
            (response: any) => {
                console.log('User added to DM list:', response);
                const dmUserId = response['dmUserId'];
                console.log('dmUserId', dmUserId);
                const user = this.authService.getUserName(dmUserId).subscribe(
                    (user) => {
                        console.log('user', user);
                        this.userListSubject.next(user);
                    },
                    (error) => {
                        console.error('Error adding user to DM list:', error);
                    }
                );
            },
            (error) => {
                console.error('Error adding user to DM list:', error);
            }
        );
    }

    removeUserFromDMList(userId: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/remove-user/${userId}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.http.delete(url, { headers });
    }
}
