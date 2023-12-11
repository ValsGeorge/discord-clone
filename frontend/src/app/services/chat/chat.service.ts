import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from 'src/app/models/message';
import { AuthService } from '../auth.service';
import { UtilsService } from '../utils.service';
import { DM } from 'src/app/models/DM';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {
        this.utilsService.connected$.subscribe((connected) => {
            if (connected) {
                this.fetchInitialMessages();
            }
        });
        this.utilsService.chatUpdated$.subscribe((message: Message) => {
            this.updateLocalMessages(message);
        });
    }

    private chatUpdatedSubject = new Subject<void>();
    chatUpdated$ = this.chatUpdatedSubject.asObservable();

    private messages: Message[] = [];
    private messageUpdateSubject = new Subject<Message[]>();
    public messageUpdate$ = this.messageUpdateSubject.asObservable();

    private DMs: DM[] = [];
    private DMUpdateSubject = new Subject<DM[]>();
    public DMUpdate$ = this.DMUpdateSubject.asObservable();

    baseUrl = 'http://localhost:8000/messages';

    updateLocalMessages(updatedMessage: Message): void {
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
        // updatedMessage.userProfilePicture =
        //     this.authService.getProfilePictureUrl(updatedMessage.userId);
        console.log('updatedMessage', updatedMessage);
        this.authService.getUserName(updatedMessage.userId).subscribe(
            (response) => {
                console.log('response', response);
                updatedMessage.username = response.username;
                updatedMessage.userProfilePicture = response.profilePicture;
            },
            (error) => {
                console.error('Error getting username:', error);
            }
        );

        this.messageUpdateSubject.next([...this.messages]);
    }

    updateLocalDMs(updatedDM: DM): void {
        // Check if the message already exists in the array
        const existingIndex = this.DMs.findIndex(
            (DM) => DM.id === updatedDM.id
        );

        if (existingIndex !== -1) {
            this.DMs.splice(existingIndex, 1, updatedDM);
        } else {
            this.DMs.push(updatedDM);
            this.DMs.sort((a, b) => +a.updatedAt - +b.updatedAt);
        }
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
        if (this.utilsService.socket) {
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

            this.utilsService.socket.emit(
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

    sendDM(content: string, senderId: string, receiverId: string): void {
        if (this.utilsService.socket) {
            this.authService.getUser().subscribe(
                (response) => {
                    console.log('response', response);
                },
                (error) => {
                    console.error('Error getting username:', error);
                }
            );

            this.utilsService.socket.emit(
                'sendDM',
                { content, senderId, receiverId },
                (response: any) => {
                    if (!response.success) {
                        console.error('Failed to send message');
                    }
                }
            );
        }
    }

    editMessage(messageId: string, content: string): void {
        if (this.utilsService.socket) {
            this.utilsService.socket.emit(
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

    fetchInitialDMs(senderId: string, receiverId: string): void {
        const params = new HttpParams()
            .set('senderId', senderId)
            .set('receiverId', receiverId);
        this.http.get<DM[]>(`${this.baseUrl}/get-dms`, { params }).subscribe(
            (initialMessages) => {
                console.log('initialMessages', initialMessages);
                const userIds = Array.from(
                    new Set(initialMessages.map((message) => message.senderId))
                );

                userIds.forEach((userId) => {
                    this.authService.getUserName(userId).subscribe(
                        (response) => {
                            console.log('response', response);
                            initialMessages.forEach((message) => {
                                // console.log('message', message);
                                if (message.senderId === userId) {
                                    message.senderUsername = response.username;
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
                this.DMs = initialMessages;
                this.DMUpdateSubject.next([...this.DMs]);
            },
            (error) => {
                console.error('Error fetching initial messages:', error);
            }
        );
    }
}
