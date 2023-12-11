import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-direct-messages',
    templateUrl: './direct-messages.component.html',
    styleUrls: ['./direct-messages.component.css'],
})
export class DirectMessagesComponent implements OnInit {
    onlineUsers: User[] = [];
    currentUser: User = {
        id: '',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    };

    constructor(
        private authService: AuthService,
        private utilsService: UtilsService,
        private chatService: ChatService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getOnlineUsers();
        console.log('Online users1:', this.onlineUsers);
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineUsers = onlineUsers;
        });
    }
    getOnlineUsers(): void {
        this.onlineUsers = this.utilsService.getOnlineUsers();
    }

    openPrivateChat(user: User): void {
        console.log('Opening private chat with:', user);
        this.chatService.fetchInitialDMs('1', '2');
        this.router.navigate(['/servers/chat-dm', user.id]);
    }
}
