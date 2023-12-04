import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from 'src/app/models/message';
import { AuthService } from '../auth.service';
import { UtilsService } from '../utils.service';
import { User } from 'src/app/models/user';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {}

    private chatUpdatedSubject = new Subject<void>();
    chatUpdated$ = this.chatUpdatedSubject.asObservable();

    private messages: Message[] = [];
    private messageUpdateSubject = new Subject<Message[]>();
    public messageUpdate$ = this.messageUpdateSubject.asObservable();

    private onlineUsersSubject = new Subject<User[]>();
    onlineUsers$ = this.onlineUsersSubject.asObservable();

    baseUrl = 'http://localhost:8000/messages';

    socketUrl = 'http://localhost:3000';

    socket: Socket | undefined;
    onlineUsers: User[] = [];
    setupSocketConnection(): void {
        console.log('Setting up socket connection');
        const token = localStorage.getItem('token');
        if (token) {
            this.socket = io(this.socketUrl, {
                query: { token },
            });

            this.socket.on('connect', () => {
                console.log('Connected to socket.io server');
                this.fetchInitialMessages();
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from socket.io server');
            });

            this.socket.on('receiveMessage', (message: any) => {
                console.log('Received message:', message);
                this.updateLocalMessages(message);
            });

            this.socket.on('updateOnlineUsers', (onlineUsers: User[]) => {
                this.onlineUsers = onlineUsers;
                this.onlineUsersSubject.next([...this.onlineUsers]);
                console.log(this.onlineUsers);
            });
        }
    }

    private updateLocalMessages(updatedMessage: Message): void {
        // Check if the message already exists in the array
        const existingIndex = this.messages.findIndex(
            (message) => message.id === updatedMessage.id
        );

        if (existingIndex !== -1) {
            this.messages.splice(existingIndex, 1, updatedMessage);
        } else {
            this.messages.push(updatedMessage);
            this.messages.sort((a, b) => +a.updatedAt - +b.updatedAt);
        }

        // Update the rest of the properties
        updatedMessage.userProfilePicture =
            this.authService.getProfilePictureUrl(updatedMessage.userId);

        this.authService.getUserName(updatedMessage.userId).subscribe(
            (response) => {
                updatedMessage.username = response.username;
            },
            (error) => {
                console.error('Error getting username:', error);
            }
        );

        this.messageUpdateSubject.next([...this.messages]);
    }

    public fetchInitialMessages(): void {
        const params = new HttpParams().set(
            'channelId',
            this.utilsService.getSelectedChannelId() || ''
        );
        console.log('params', params);
        this.http
            .get<Message[]>(`${this.baseUrl}/get-messages`, { params })
            .subscribe(
                (initialMessages) => {
                    const userIds = Array.from(
                        new Set(
                            initialMessages.map((message) => message.userId)
                        )
                    );

                    userIds.forEach((userId) => {
                        this.authService.getUserName(userId).subscribe(
                            (response) => {
                                initialMessages.forEach((message) => {
                                    if (message.userId === userId) {
                                        message.username = response.username;
                                        message.userProfilePicture =
                                            'http://localhost:8000/users/uploads/' +
                                            response.id;
                                    }
                                });
                            },
                            (error) => {
                                console.error('Error getting username:', error);
                            }
                        );
                    });
                    this.messages = initialMessages;
                    this.messageUpdateSubject.next([...this.messages]);
                },
                (error) => {
                    console.error('Error fetching initial messages:', error);
                }
            );
    }

    sendMessage(content: string, channelId: string): void {
        if (this.socket) {
            this.authService.getUser().subscribe(
                (response) => {
                    console.log('response', response);
                    const userId = response.id;
                    const username = response.username;

                    const lastId =
                        this.messages.length > 0
                            ? this.messages[this.messages.length - 1].id
                            : '';

                    const newMessage: Message = {
                        content,
                        userId,
                        channelId,
                        id: lastId + 1,
                        username: username,
                        userProfilePicture:
                            this.authService.getProfilePictureUrl(userId),
                        createdAt: new Date(0),
                        updatedAt: new Date(0),
                    };
                },
                (error) => {
                    console.error('Error getting username:', error);
                }
            );

            this.socket.emit(
                'sendMessage',
                { content, channelId },
                (response: any) => {
                    if (!response.success) {
                        console.error('Failed to send message');
                    }
                }
            );
        }
    }

    editMessage(messageId: string, content: string): void {
        if (this.socket) {
            this.socket.emit(
                'editMessage',
                { id: messageId, content },
                (response: any) => {
                    if (!response.success) {
                        console.error('Failed to edit message');
                    }
                }
            );
        }
    }
}
