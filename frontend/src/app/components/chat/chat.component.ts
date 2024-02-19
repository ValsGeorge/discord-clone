import { Component, QueryList, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Channels } from 'src/app/models/channel';
import { ChannelsService } from 'src/app/services/channels/channels.service';
import { Title } from '@angular/platform-browser';

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
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private channelsService: ChannelsService,
        private titleService: Title
    ) {
        this.editMessageForm = this.formBuilder.group({
            editedContent: [''], // Add a form control for edited content
        });
    }

    messages: Message[] = [];

    showOptionsForMessage: string | null = null;

    editMessageForm: FormGroup;

    channel: Channels = {
        id: '',
        name: '',
        description: '',
        type: '',
        messages: [],
        created_at: '',
        updated_at: '',
        category: '',
        server: '',
        order: 0,
    };

    loading: boolean = false;

    ngOnInit(): void {
        this.chatService.messageUpdate$.subscribe((updatedMessages) => {
            this.messages = updatedMessages;
            setTimeout(() => {
                this.loading = false;
            }, 1000);
            const selectedChannelId = this.utilsService.getSelectedChannelId();
            this.channelsService
                .getChannelInfo(selectedChannelId)
                .subscribe((channelInfo) => {
                    this.channel = channelInfo;
                    let currentTitle = this.titleService.getTitle();
                    // Current title right now should be 'Biscord | ServerName'
                    // If the title is 'Biscord | ServerName | <Something>' then we want to remove the <Something>
                    const titleParts = currentTitle.split('|');
                    currentTitle = titleParts[0] + '|' + titleParts[1];

                    this.titleService.setTitle(
                        `${currentTitle} | ${this.channel.name}`
                    );
                });
        });
    }

    sendMessage(): void {
        if (this.messageContent != '') {
            this.chatService.sendMessage(
                this.messageContent,
                this.utilsService.getSelectedChannelId()
            );
            this.messageContent = '';
        }
    }

    getProfilePictureUrl(userId: string): string {
        return this.authService.getProfilePictureUrl(userId);
    }
    showOptions(message: Message): void {
        const userId = this.authService.getUserId();
        if (message.user == userId) this.showOptionsForMessage = message.id;
    }

    hideOptions(): void {
        this.showOptionsForMessage = null;
    }
    handleEditClick(message: Message): void {
        this.startEditing(message);
    }

    startEditing(message: Message): void {
        message.isEditing = true;
        this.editMessageForm.setValue({
            editedContent: message.content,
        });
    }

    cancelEditing(message: Message): void {
        message.isEditing = false;
    }

    saveEditedMessage(message: Message): void {
        const editedContent = this.editMessageForm.value.editedContent;
        message.content = editedContent;
        this.chatService.editMessage(message);
        message.isEditing = false;
    }

    deleteMessage(message: Message): void {
        console.log('deleting message');
        this.chatService.deleteMessage(message);
    }
}
