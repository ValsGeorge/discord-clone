import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
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
        private utilsService: UtilsService
    ) {
        console.log('Online users:', this.onlineUsers);
    }

    ngOnInit(): void {
        this.getOnlineUsers();
        console.log('Online users1:', this.onlineUsers);
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineUsers = onlineUsers;
            console.log('Online users2:', this.onlineUsers);
        });
    }
    getOnlineUsers(): void {
        this.onlineUsers = this.utilsService.getOnlineUsers();
        console.log('Online users3:', this.onlineUsers);
    }
}
