import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from '../utils.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private http: HttpClient, private utilsService: UtilsService) {}

    private chatUpdatedSubject = new Subject<void>();
    chatUpdated$ = this.chatUpdatedSubject.asObservable();

    selectedServerId: string | null = null;
    selectedChannelId: string | null = null;

    baseUrl = 'http://localhost:8000/messages';

    updateChat(channelId: string) {
        this.chatUpdatedSubject.next();
        this.getMessages(channelId).subscribe(
            (messages) => {},
            (error) => {
                console.error('Error getting messages:', error);
            }
        );
    }

    getMessages(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/get-messages`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };

        const data = {
            channelId: channelId,
        };

        return this.http.get(url, { headers, params: data });
    }

    sendMessage(content: string, serverId: string, channelId: string): void {
        const url = `${this.baseUrl}/create-message`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };

        const data = {
            content: content,
            userId: serverId,
            channelId: channelId,
        };

        this.http.post(url, data, { headers }).subscribe(
            (response) => {
                console.log('Response:', response);
            },
            (error) => {
                console.error('Error sending message:', error);
            }
        );

        this.updateChat(channelId);
    }
}
