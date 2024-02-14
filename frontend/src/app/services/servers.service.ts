import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServerMembers } from '../models/serverMembers';
import { User } from '../models/user';
import { Title } from '@angular/platform-browser';
import { Servers } from '../models/server';

@Injectable({
    providedIn: 'root',
})
export class ServersService {
    private showDialogSubject = new BehaviorSubject<boolean>(false);
    showDialogObservable = this.showDialogSubject.asObservable();

    private serversUpdatedSubject = new Subject<void>();
    serversUpdated$ = this.serversUpdatedSubject.asObservable();

    serverMembers: ServerMembers[] = [];

    servers: Servers[] = [];

    constructor(private httpClient: HttpClient, private title: Title) {}

    baseUrl = `${environment.baseUrl}/servers`;

    openDialog() {
        this.showDialogSubject.next(true);
    }

    closeDialog() {
        this.showDialogSubject.next(false);
    }

    updateServers() {
        this.serversUpdatedSubject.next();
    }

    createServer(serverName: string): Observable<any> {
        const url = `${this.baseUrl}/`;
        const body = {
            name: serverName,
            description: 'a',
        };

        return this.httpClient
            .post(url, body, {
                withCredentials: true,
            })
            .pipe(
                tap(() => {
                    this.updateServers();
                }),
                catchError((error: any) => {
                    return error;
                })
            );
    }

    getServers(): Observable<any> {
        const url = `${this.baseUrl}/`;

        return this.httpClient.get(url, { withCredentials: true }).pipe(
            (response: any) => {
                console.log('servers response', response);
                return response;
            },
            (error: any) => {
                return error;
            }
        );
    }

    generateInviteCode(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/generate-invite-code/${serverId}`;
        const body = { serverId: serverId };

        return this.httpClient.get(url, {
            params: body,
            withCredentials: true,
        });
    }

    joinServer(inviteCode: string): Observable<any> {
        const url = `${this.baseUrl}/join-server`;
        const body = { inviteCode: inviteCode };
        return this.httpClient.post(url, body, { withCredentials: true });
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
        const url = `${this.baseUrl}/${serverId}`;

        return this.httpClient.delete(url, { withCredentials: true });
    }

    getServerInfo(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/${serverId}`;
        return this.httpClient.get(url, { withCredentials: true }).pipe(
            tap((server: any) => {
                this.title.setTitle(`Biscord | ${server.name}`);
            }),
            catchError((error: any) => {
                return error;
            })
        );
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

    getServerMembers(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/members/${serverId}`;
        // check if the serverMembers array already has the serverId
        const serverIndex = this.serverMembers.findIndex(
            (server) => server.serverId === serverId
        );
        if (serverIndex !== -1) {
            return new Observable((observer) => {
                observer.next(this.serverMembers[serverIndex].members);
                observer.complete();
            });
        }
        return this.httpClient.get<User[]>(url, { withCredentials: true }).pipe(
            tap((members: User[]) => {
                // check to see if the serverId is already in the serverMembers array
                const serverIndex = this.serverMembers.findIndex(
                    (server) => server.serverId === serverId
                );
                if (serverIndex !== -1) {
                    this.serverMembers[serverIndex].members = members;
                } else {
                    this.serverMembers.push({ serverId, members });
                }
            }),
            catchError((error: any) => {
                return error;
            })
        );
    }
}
