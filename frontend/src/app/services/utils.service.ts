import { Injectable } from '@angular/core';
import { ChatService } from './chat/chat.service';
import { io, Socket } from 'socket.io-client';
import { User } from '../models/user';
import { Subject } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor() {}

    socketUrl = 'http://localhost:3000';

    socket: Socket | undefined;
    onlineUsers: User[] = [];

    private onlineUsersSubject = new Subject<User[]>();
    onlineUsers$ = this.onlineUsersSubject.asObservable();

    private connectedSubject = new Subject<boolean>();
    connected$ = this.connectedSubject.asObservable();

    private chatUpdatedSubject = new Subject<Message>();
    chatUpdated$ = this.chatUpdatedSubject.asObservable();

    setupSocketConnection(): void {
        console.log('Setting up socket connection');
        const token = localStorage.getItem('token');
        if (token) {
            this.socket = io(this.socketUrl, {
                query: { token },
            });

            this.socket.on('connect', () => {
                console.log('Connected to socket.io server');
                this.connectedSubject.next(true);
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from socket.io server');
            });

            this.socket.on('receiveMessage', (message: any) => {
                console.log('Received message:', message);
                this.chatUpdatedSubject.next(message);
                // this.chatService.updateLocalMessages(message);
            });

            this.socket.on('updateOnlineUsers', (onlineUsers: User[]) => {
                console.log('Online users:', onlineUsers);
                this.onlineUsers = onlineUsers;
                this.onlineUsersSubject.next([...this.onlineUsers]);
            });
        }
    }

    updateOnlineUsers() {
        this.onlineUsersSubject.next([...this.onlineUsers]);
    }

    getOnlineUsers() {
        return this.onlineUsers;
    }

    setSelectedServerId(serverId: string) {
        localStorage.setItem('selectedServerId', serverId);
    }

    getSelectedServerId(): string {
        return localStorage.getItem('selectedServerId') || '0';
    }

    setSelectedChannelId(channelId: string) {
        localStorage.setItem('selectedChannelId', channelId);
    }

    getSelectedChannelId(): string {
        return localStorage.getItem('selectedChannelId') || '0';
    }
}
