import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-open-user-info-details',
    templateUrl: './open-user-info-details.component.html',
    styleUrls: ['./open-user-info-details.component.css'],
})
export class OpenUserInfoDetailsComponent {
    @Input() user: User = {
        id: '0',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userProfilePicture: '',
    };
    @Input() position: { top: number; left: number } = { top: 0, left: 0 };
    @Input() bottomOffset: number = 0;
    constructor(private authService: AuthService) {
        this.authService.getUser().subscribe((user) => {
            console.log('user:', user);
            this.user = user;
            this.user.userProfilePicture =
                this.authService.getProfilePictureUrl(this.user.id);
        });
    }
}
