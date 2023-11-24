import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from 'src/app/models/message';
import { AuthService } from '../auth.service';
import { UtilsService } from '../utils.service';

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

    baseUrl = 'http://localhost:8000/messages';

    socketUrl = 'http://localhost:3000';

    socket: Socket | undefined;
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
        }
    }

    private updateLocalMessages(message: Message): void {
        this.messages.push(message);
        message.userProfilePicture = this.authService.getProfilePictureUrl(
            message.userId
        );
        this.authService.getUserName(message.userId).subscribe(
            (response) => {
                message.username = response.username;
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
        this.http
            .get<Message[]>(`${this.baseUrl}/get-messages`, { params })
            .subscribe(
                (initialMessages) => {
                    // for each message get the profile picture url and the username
                    initialMessages.forEach((message) => {
                        message.userProfilePicture =
                            this.authService.getProfilePictureUrl(
                                message.userId
                            );
                        this.authService.getUserName(message.userId).subscribe(
                            (response) => {
                                message.username = response.username;
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
                    };

                    // this.updateLocalMessages(newMessage);
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
}
