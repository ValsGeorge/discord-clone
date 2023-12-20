import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { DM } from 'src/app/models/DM';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-chat-dm',
    templateUrl: './chat-dm.component.html',
    styleUrls: ['./chat-dm.component.css'],
})
export class ChatDmComponent implements OnInit {
    @ViewChild('chatContainer') private chatContainer!: ElementRef;

    messageContent: string = '';
    constructor(
        private chatService: ChatService,
        private utilsService: UtilsService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.editMessageForm = this.formBuilder.group({
            editedContent: [''], // Add a form control for edited content
        });
    }

    receiver: User = {
        id: '',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    };

    onlineUserIds = new Set<string>();

    messages: DM[] = [];

    showOptionsForMessage: number | null = null;

    editMessageForm: FormGroup;

    isReceiverOnline(): boolean {
        const receiverId = this.route.snapshot.paramMap.get('userId') as string;
        return this.utilsService.isUserOnline(receiverId);
    }

    ngOnInit(): void {
        this.editMessageForm = this.formBuilder.group({
            editedContent: [''], // Add a form control for edited content
        });

        this.authService.getUser().subscribe((user) => {
            const userId = user.id;
            const receiverId = this.route.snapshot.paramMap.get(
                'userId'
            ) as string;
            this.chatService.fetchInitialDMs(userId, receiverId);
            this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
                this.onlineUserIds = new Set(
                    onlineUsers.map((user) => user.id)
                );
            });
        });

        this.route.paramMap.subscribe((params) => {
            const receiverId = params.get('userId') as string;
            this.authService.getUserName(receiverId).subscribe((user) => {
                this.receiver = user;
            });
        });
        this.chatService.DMUpdate$.subscribe((updatedMessages) => {
            this.messages = updatedMessages;
            console.log('Messages:', this.messages);
            this.scrollToBottom();
        });
    }

    sendDM(): void {
        const receiverId = this.route.snapshot.paramMap.get('userId') as string;
        if (this.messageContent != '')
            this.chatService.sendDM(
                this.messageContent,
                this.authService.getUserId(),
                receiverId
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
    handleEditClick(message: DM): void {
        this.startEditing(message);
    }

    startEditing(message: DM): void {
        message.isEditing = true;
        this.editMessageForm.setValue({
            editedContent: message.content,
        });
    }

    cancelEditing(message: DM): void {
        message.isEditing = false;
    }

    saveEditedMessage(message: DM): void {
        const editedContent = this.editMessageForm.value.editedContent;
        this.chatService.editMessage(message.id, editedContent);
        message.content = editedContent;
        message.isEditing = false;
    }
    scrollToBottom(): void {
        try {
            this.chatContainer.nativeElement.scrollTop =
                this.chatContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error(err);
        }
    }
}
