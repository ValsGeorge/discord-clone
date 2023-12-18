import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
    providedIn: 'root',
})
export class DirectMessagesService {
    constructor(private authService: AuthService, private http: HttpClient) {}

    baseUrl = 'http://localhost:8000/dm-list';

    getDMList(): Observable<User> {
        console.log('test');
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.http.get(url, { headers }) as Observable<User>;
    }

    addUserToDMList(userId: string): Observable<any> {
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

        return this.http.post(url, payload, { headers });
    }
}
