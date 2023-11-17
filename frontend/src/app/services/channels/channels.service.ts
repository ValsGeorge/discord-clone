import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChannelsService {
    constructor(private http: HttpClient) {}

    baseUrl = 'http://localhost:8000/channels';

    createChannel(name: string, serverId: string): Observable<any> {
        const url = `${this.baseUrl}/create`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.post(
            url,
            { name, serverId, type: 'text' },
            { headers }
        );
    }

    getChannels(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/get-channels/${serverId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { headers });
    }
}
