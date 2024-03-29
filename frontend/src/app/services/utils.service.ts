import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from '../models/user';
import { Subject } from 'rxjs';
import { Message } from '../models/message';
import { AuthService } from './auth.service';
import { FriendsService } from './friends/friends.service';
import { Friend, FriendRequest } from '../models/friends';
import { ServerMembers } from '../models/serverMembers';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor(
        private authService: AuthService,
        private friendsService: FriendsService
    ) {}

    socketUrl = 'http://localhost:3000';

    socket: Socket | undefined;
    onlineUsers: User[] = [];
    onlineFriends: Friend[] = [];

    private onlineUsersSubject = new Subject<User[]>();
    onlineUsers$ = this.onlineUsersSubject.asObservable();

    private onlineFriendsSubject = new Subject<Friend[]>();
    onlineFriends$ = this.onlineFriendsSubject.asObservable();

    private friendRequestsSubject = new Subject<FriendRequest[]>();
    friendRequests$ = this.friendRequestsSubject.asObservable();

    private connectedSubject = new Subject<boolean>();
    connected$ = this.connectedSubject.asObservable();

    private chatUpdatedSubject = new Subject<Message>();
    chatUpdated$ = this.chatUpdatedSubject.asObservable();

    private serverMembersUpdatedSubject = new Subject<ServerMembers>();
    serverMembersUpdated$ = this.serverMembersUpdatedSubject.asObservable();

    private connectedUser: any = {};

    setupSocketConnection(): void {
        console.log('Setting up socket connection');

        this.socket = io(this.socketUrl, {
            withCredentials: true,
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
            this.chatUpdatedSubject.next(message);
        });

        this.socket.on('updateOnlineUsers', (onlineUsers: User[]) => {
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
            // console.log('From:', from);
            this.chatUpdatedSubject.next(message);
        });
        this.socket.on('receiveFriendRequest', (request: any) => {
            this.friendRequestsSubject.next(request);
        });
        this.socket.on('exception', (exception: any) => {
            console.log('Exception:', exception);
        });
    }

    updateOnlineUsers() {
        this.onlineUsersSubject.next([...this.onlineUsers]);
    }

    updateOnlineFriends() {
        // based on the user id I have to call the backend and check for every friend if he is online
        this.friendsService.getFriends().subscribe((friends) => {
            this.onlineFriends = friends.filter((friend: any) =>
                this.onlineUsers.find((user) => user.id === friend.id)
            );
            this.onlineFriends.forEach((friend) => {
                friend.friend.profilePicture =
                    this.authService.getProfilePictureUrl(friend.friend.id);
            });
            this.onlineFriendsSubject.next([...this.onlineFriends]);
        });
        this.onlineFriendsSubject.next([...this.onlineFriends]);
    }

    updateServerMembers(serverId: string, members: User[]) {}

    getOnlineUsers() {
        return this.onlineUsers;
    }

    getOnlineFriends() {
        return this.onlineFriends;
    }

    isUserOnline(userId: string): boolean {
        return this.onlineUsers.some((user) => user.id === userId);
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
