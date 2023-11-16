import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Channels } from 'src/app/models/server';
import { ChannelsService } from 'src/app/services/channels.service';

@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private channelsService: ChannelsService
    ) {}

    user: User = {
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    servers: Channels[] = [];

    ngOnInit(): void {
        this.getUserInfo();
        this.getServers();
    }

    openCreateServer() {
        this.channelsService.openDialog();
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
    getServers() {
        this.channelsService.getServers().subscribe(
            (response: any) => {
                this.servers = response;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
}
