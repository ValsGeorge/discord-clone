import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
    trigger,
    transition,
    style,
    animate,
    state,
    keyframes,
} from '@angular/animations';
import { User } from '../../models/user';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css'],
    animations: [
        trigger('rollText', [
            state('initial', style({ transform: 'translateY(0)' })),
            state('rolled', style({ transform: 'translateY(-100%)' })),
            transition('initial => rolled', animate('150ms ease-in')),
            transition('rolled => initial', animate('150ms ease-out')),
        ]),
    ],
})
export class UserInfoComponent implements OnInit {
    constructor(private authService: AuthService) {}

    user: User = {
        id: '0',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userProfilePicture: '',
    };
    ngOnInit(): void {
        this.getUserInfo();
    }

    getUserInfo() {
        this.authService.getUser().subscribe(
            (response: User) => {
                this.user = response;
                this.user.userProfilePicture =
                    this.authService.getProfilePictureUrl(this.user.id);
                console.log(response);
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    rollTextState = 'initial';

    onMouseEnter() {
        this.rollTextState = 'rolled';
    }

    onMouseLeave() {
        this.rollTextState = 'initial';
    }
}
