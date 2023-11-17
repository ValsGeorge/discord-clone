import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
    constructor(private authService: AuthService) {}

    user: any = {
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    ngOnInit(): void {
        this.getUserInfo();
    }

    getUserInfo() {
        this.authService.getUser().subscribe(
            (response: any) => {
                this.user = response;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
}
