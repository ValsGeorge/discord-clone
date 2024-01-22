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
        const url = `${this.baseUrl}/`;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        const body = {
            name: serverName['serverName'],
            description: 'a',
            type: 'text',
        };

        return this.httpClient.post(url, body, {
            headers,
            withCredentials: true,
        });
    }

    getServers(): Observable<any> {
        const url = `${this.baseUrl}/`;

        return this.httpClient.get(url, { withCredentials: true }).pipe(
            (response: any) => {
                return response;
            },
            (error: any) => {
                return error;
            }
        );
    }

    generateInviteCode(serverId: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/generate-invite-code/${serverId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });
        const body = { serverId: serverId };

        return this.httpClient.get(url, {
            headers,
            params: body,
            withCredentials: true,
        });
    }

    joinServer(inviteCode: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/join-server`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });
        const body = { inviteCode: inviteCode };

        return this.httpClient.post(url, body, {
            headers,
            withCredentials: true,
        });
    }

    leaveServer(serverId: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/leave-server`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });
        const body = { serverId: serverId };

        return this.httpClient.post(url, body, { headers });
    }

    deleteServer(serverId: string): Observable<any> {
        console.log('delete server with id', serverId);
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/delete-server/${serverId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });
        console.log('token: ', token);
        console.log('URL: ', url);

        return this.httpClient.delete(url, { headers });
    }

    getServerInfo(serverId: string): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/server-info/${serverId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            token: token,
        });

        return this.httpClient.get(url, { headers });
    }

    uploadServerImage(serverId: string, image: File): Observable<any> {
        const token = localStorage.getItem('token') as string;
        const url = `${this.baseUrl}/upload-server-image`;
        const formData = new FormData();
        formData.append('file', image);
        formData.append('serverId', serverId);

        const headers = new HttpHeaders({
            token: token,
        });

        return this.httpClient.post(url, formData, { headers });
    }

    getServerImageUrl(serverId: string): string {
        return `${this.baseUrl}/server-image/${serverId}`;
    }
}
