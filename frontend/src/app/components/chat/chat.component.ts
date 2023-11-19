import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChannelsService } from 'src/app/services/channels/channels.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
    messageContent: string = '';
    constructor(
        private chatService: ChatService,
        private channelsService: ChannelsService,
        private utilsService: UtilsService,
        private authService: AuthService
    ) {}

    messages: Message[] = [];

    ngOnInit(): void {
        this.getMessages(this.utilsService.getSelectedChannelId());
        this.chatService.chatUpdated$.subscribe(() => {
            this.getMessages(this.utilsService.getSelectedChannelId());
        });
    }

    sendMessage(): void {
        this.chatService.sendMessage(
            this.messageContent,
            this.utilsService.getSelectedServerId(),
            this.utilsService.getSelectedChannelId()
        );
    }

    getMessages(channelId: string): void {
        this.chatService.getMessages(channelId).subscribe(
            (response) => {
                this.messages = response;
                // iterate through messages and add the username to each message
                this.messages.forEach((message) => {
                    this.authService
                        .getUserName(message.userId)
                        .subscribe((user: any) => {
                            message.username = user.username;
                        });
                });
            },
            (error) => {
                console.error('Error getting messages:', error);
            }
        );
    }
}
