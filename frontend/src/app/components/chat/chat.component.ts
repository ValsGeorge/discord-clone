import { Component, QueryList, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Channels } from 'src/app/models/channel';
import { ChannelsService } from 'src/app/services/channels/channels.service';

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
        private channelsService: ChannelsService
    ) {
        this.editMessageForm = this.formBuilder.group({
            editedContent: [''], // Add a form control for edited content
        });
    }

    messages: Message[] = [];

    showOptionsForMessage: number | null = null;

    editMessageForm: FormGroup;

    channel: Channels = {
        id: '',
        name: '',
        type: '',
        messages: [],
        created_at: '',
        updated_at: '',
        categoryId: '',
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
                });
        });
    }

    sendMessage(): void {
        if (this.messageContent != '')
            this.chatService.sendMessage(
                this.messageContent,
                this.utilsService.getSelectedChannelId()
            );
    }

    getProfilePictureUrl(userId: string): string {
        return this.authService.getProfilePictureUrl(userId);
    }
    showOptions(message: any): void {
        const userId = this.authService.getUserId();
        if (message.userId == userId) this.showOptionsForMessage = message.id;
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
        this.chatService.editMessage(message.id, editedContent);
        message.content = editedContent;
        message.isEditing = false;
    }
}
