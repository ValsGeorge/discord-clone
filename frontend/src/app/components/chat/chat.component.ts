import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
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
        private utilsService: UtilsService,
        private authService: AuthService
    ) {}

    messages: Message[] = [];

    ngOnInit(): void {
        this.chatService.messageUpdate$.subscribe((updatedMessages) => {
            this.messages = updatedMessages;
        });

        this.chatService.setupSocketConnection();
    }

    sendMessage(): void {
        this.chatService.sendMessage(
            this.messageContent,
            this.utilsService.getSelectedChannelId()
        );
    }

    getProfilePictureUrl(userId: string): string {
        return this.authService.getProfilePictureUrl(userId);
    }
}
