import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-server-details',
    templateUrl: './server-details.component.html',
    styleUrls: ['./server-details.component.css'],
})
export class ServerDetailsComponent {
    serverId!: string;
    channelId!: string;
    constructor(
        private route: ActivatedRoute,
        private serversService: ServersService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.serverId = params['id'];
        });
    }
}
