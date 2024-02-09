import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from 'src/app/models/message';
import { AuthService } from '../auth.service';
import { UtilsService } from '../utils.service';
import { DM } from 'src/app/models/DM';
import { environment } from 'src/environments/environment';

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
        this.utilsService.chatUpdated$.subscribe((message: any) => {
            // check the type o message
            // if it is Message, then updateLocalMessages
            // if it is DM, then updateLocalDMs
            if (message.channel) {
                this.updateLocalMessages(message);
            } else {
                this.updateLocalDMs(message);
            }
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

    messagesUrl = `${environment.baseUrl}/messages`;
    dmsUrl = `${environment.baseUrl}/dms`;

    updateLocalMessages(updatedMessage: Message): void {
        // Check if the message already exists in the array
        console.log('updatedMessage', updatedMessage);
        const existingIndex = this.messages.findIndex(
            (message) => message.id === updatedMessage.id
        );
        console.log('existingIndex', existingIndex);

        if (existingIndex !== -1) {
            this.messages.splice(existingIndex, 1, updatedMessage);
        } else {
            this.messages.push(updatedMessage);
            this.messages.sort((a, b) => +a.updatedAt - +b.updatedAt);
        }

        this.authService.getUserName(updatedMessage.user).subscribe(
            (response) => {
                updatedMessage.username = response.username;
                updatedMessage.userProfilePicture =
                    this.authService.getProfilePictureUrl(updatedMessage.user);
            },
            (error) => {
                console.error('Error getting username:', error);
            }
        );
        this.messageUpdateSubject.next([...this.messages]);
    }

    updateLocalDMs(updatedDM: DM): void {
        // Check if the message already exists in the array
        console.log('updatedDM', updatedDM);
        const existingIndex = this.DMs.findIndex(
            (DM) => DM.id === updatedDM.id
        );

        if (existingIndex !== -1) {
            this.DMs.splice(existingIndex, 1, updatedDM);
        } else {
            this.DMs.push(updatedDM);
            this.DMs.sort((a, b) => +a.updatedAt - +b.updatedAt);
        }

        this.authService.getUserName(updatedDM.sender).subscribe(
            (response) => {
                updatedDM.senderUsername = response.username;
                updatedDM.userProfilePicture =
                    this.authService.getProfilePictureUrl(updatedDM.sender);
            },
            (error) => {
                console.error('Error getting username:', error);
            }
        );

        this.DMUpdateSubject.next([...this.DMs]);
    }

    public fetchInitialMessages(): void {
        this.http
            .get<Message[]>(
                `${
                    this.messagesUrl
                }/${this.utilsService.getSelectedChannelId()}`,
                { withCredentials: true }
            )
            .subscribe(
                (initialMessages) => {
                    const userIds = Array.from(
                        new Set(initialMessages.map((message) => message.user))
                    );
                    userIds.forEach((userId) => {
                        this.authService.getUserName(userId).subscribe(
                            (response) => {
                                initialMessages.forEach((message) => {
                                    if (message.user === userId) {
                                        message.username = response.username;
                                        message.userProfilePicture =
                                            `${environment.baseUrl}/user/uploads/` +
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
            this.utilsService.socket.emit('sendDM', {
                dm: { content, senderId, receiverId },
                to: receiverId,
            });
        }
    }

    editDM(dm: DM): void {
        if (this.utilsService.socket) {
            console.log('dm', dm);
            this.utilsService.socket.emit('editDM', dm, (response: any) => {
                if (!response.success) {
                    console.error('Failed to edit dm');
                }
            });
        }
    }

    editMessage(message: Message): void {
        if (this.utilsService.socket) {
            console.log('message', message);
            this.utilsService.socket.emit(
                'editMessage',
                message,
                (response: any) => {
                    if (!response.success) {
                        console.error('Failed to edit message');
                    }
                }
            );
        }
    }

    fetchInitialDMs(senderId: string, receiverId: string): void {
        this.http
            .get<DM[]>(`${this.dmsUrl}/${senderId}/${receiverId}`, {
                withCredentials: true,
            })
            .subscribe(
                (initialMessages) => {
                    if (initialMessages == null) {
                        return;
                    }

                    const userIds = Array.from(
                        new Set(
                            initialMessages.map((message) => message?.sender)
                        )
                    );

                    userIds.forEach((userId) => {
                        this.authService.getUserName(userId).subscribe(
                            (response) => {
                                initialMessages.forEach((message) => {
                                    // console.log('message', message);
                                    if (message.sender === userId) {
                                        message.senderUsername =
                                            response.username;
                                        message.userProfilePicture =
                                            `${environment.baseUrl}/user/uploads/` +
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
