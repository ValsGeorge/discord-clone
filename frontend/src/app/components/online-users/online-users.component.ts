import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
    selector: 'app-online-users',
    templateUrl: './online-users.component.html',
    styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
    onlineUsers: User[] = [];

    constructor(
        private chatService: ChatService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.chatService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineUsers = onlineUsers;
            console.log('@onlineUsers', this.onlineUsers);
            // for each user, get their profile picture
            this.onlineUsers.forEach((user) => {
                user.userProfilePicture = this.authService.getProfilePictureUrl(
                    user.id
                );
            });
        });
        console.log('onlineUsers', this.onlineUsers);
    }
}
