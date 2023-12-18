import { Injectable } from '@angular/core';
import { ChatService } from './chat/chat.service';
import { io, Socket } from 'socket.io-client';
import { User } from '../models/user';
import { Subject } from 'rxjs';
import { Message } from '../models/message';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor(private authService: AuthService) {}

    socketUrl = 'http://localhost:3000';

    socket: Socket | undefined;
    onlineUsers: User[] = [];
    onlineFriends: User[] = [];

    private onlineUsersSubject = new Subject<User[]>();
    onlineUsers$ = this.onlineUsersSubject.asObservable();

    private onlineFriendsSubject = new Subject<User[]>();
    onlineFriends$ = this.onlineFriendsSubject.asObservable();

    private friendRequestsSubject = new Subject<User[]>();
    friendRequests$ = this.friendRequestsSubject.asObservable();

    private connectedSubject = new Subject<boolean>();
    connected$ = this.connectedSubject.asObservable();

    private chatUpdatedSubject = new Subject<Message>();
    chatUpdated$ = this.chatUpdatedSubject.asObservable();

    private connectedUser: any = {};

    setupSocketConnection(): void {
        console.log('Setting up socket connection');
        const token = localStorage.getItem('token');
        if (token) {
            this.socket = io(this.socketUrl, {
                query: { token },
            });

            this.socket.on('connect', () => {
                console.log('Connected to socket.io server');

                if (this.socket) {
                    this.connectedUser[this.authService.getUserId()] =
                        this.socket.id;
                }

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
                this.onlineUsers.forEach((user) => {
                    user.profilePicture = this.authService.getProfilePictureUrl(
                        user.id
                    );
                });
                this.onlineUsersSubject.next([...this.onlineUsers]);
                this.updateOnlineFriends();
            });
            this.socket.on('privateMessage', (message) => {
                console.log('Received private message:', message);
                // console.log('From:', from);
                this.chatUpdatedSubject.next(message);
            });
            this.socket.on('receiveFriendRequest', (request: any) => {
                console.log('Received friend request:', request);

                this.friendRequestsSubject.next(request);
            });
        }
    }

    updateOnlineUsers() {
        this.onlineUsersSubject.next([...this.onlineUsers]);
    }

    updateOnlineFriends() {
        // based on the user id I have to call the backend and check for every friend if he is online
        this.authService.getFriends().subscribe((friends) => {
            this.onlineFriends = friends.filter((friend: any) =>
                this.onlineUsers.find((user) => user.id === friend.id)
            );
            this.onlineFriends.forEach((friend) => {
                friend.profilePicture = this.authService.getProfilePictureUrl(
                    friend.id
                );
            });
            this.onlineFriendsSubject.next([...this.onlineFriends]);
        });
        this.onlineFriendsSubject.next([...this.onlineFriends]);
    }
    getOnlineUsers() {
        return this.onlineUsers;
    }

    getOnlineFriends() {
        // return this.onlineFriends;
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
