import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChannelsService {
    private showDialogSubject = new BehaviorSubject<boolean>(false);
    showDialogObservable = this.showDialogSubject.asObservable();
    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {}

    baseUrl = 'http://localhost:8000/channels';

    openDialog() {
        this.showDialogSubject.next(true);
        console.log('open dialog');
    }

    closeDialog() {
        this.showDialogSubject.next(false);
        console.log('close dialog');
    }

    createServer(serverName: any): Observable<any> {
        console.log(serverName);
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/create-channel`;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        const body = { name: serverName['serverName'] };

        // Subscribe to the Observable returned by HttpClient.post
        return this.httpClient.post(url, body, { headers });
    }

    getServers(): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/get-channels`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.httpClient.get(url, { headers });
    }
}
