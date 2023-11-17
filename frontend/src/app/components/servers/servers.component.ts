import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Servers } from 'src/app/models/server';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-channels',
    templateUrl: './servers.component.html',
    styleUrls: ['./servers.component.css'],
})
export class ServersComponent {
    constructor() {}

    user: User = {
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };
}
