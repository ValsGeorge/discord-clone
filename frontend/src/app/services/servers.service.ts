import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServersService {
    private showDialogSubject = new BehaviorSubject<boolean>(false);
    showDialogObservable = this.showDialogSubject.asObservable();

    private serversUpdatedSubject = new Subject<void>();
    serversUpdated$ = this.serversUpdatedSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    baseUrl = 'http://localhost:8000/servers';

    openDialog() {
        this.showDialogSubject.next(true);
        console.log('open dialog1');
    }

    closeDialog() {
        this.showDialogSubject.next(false);
        console.log('close dialog');
    }

    updateServers() {
        console.log('update servers');
        this.serversUpdatedSubject.next();
    }

    createServer(serverName: any): Observable<any> {
        console.log(serverName);
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/create-server`;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        const body = { name: serverName['serverName'] };

        return this.httpClient.post(url, body, { headers });
    }

    getServers(): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/get-servers`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.httpClient.get(url, { headers });
    }

    generateInviteCode(serverId: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/generate-invite-code/${serverId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });
        const body = { serverId: serverId };

        return this.httpClient.get(url, { headers, params: body });
    }

    joinServer(inviteCode: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/join-server`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });
        const body = { inviteCode: inviteCode };

        return this.httpClient.post(url, body, { headers });
    }
}
