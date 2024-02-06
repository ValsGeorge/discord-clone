import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-join-server',
    templateUrl: './join-server.component.html',
    styleUrls: ['./join-server.component.css'],
})
export class JoinServerComponent {
    constructor(
        private serversService: ServersService,
        private route: ActivatedRoute
    ) {
        this.joinServer();
    }

    joinServer(): void {
        const inviteCode = this.route.snapshot.paramMap.get('inviteCode');
        console.log('inviteCode: ' + inviteCode);
        // Check if inviteCode is not null
        if (inviteCode !== null) {
            this.serversService.joinServer(inviteCode).subscribe(
                (response) => {
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            console.error('Invalid invite code: inviteCode is null');
        }
    }
}
