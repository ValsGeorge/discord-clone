import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-online-users',
    templateUrl: './online-users.component.html',
    styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
    onlineUsers: User[] = [];

    constructor(
        private authService: AuthService,
        private utilsService: UtilsService
    ) {}

    ngOnInit() {
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineUsers = onlineUsers;
            // for each user, get their profile picture
            this.onlineUsers.forEach((user) => {
                user.userProfilePicture = this.authService.getProfilePictureUrl(
                    user.id
                );
            });
        });
    }
}
