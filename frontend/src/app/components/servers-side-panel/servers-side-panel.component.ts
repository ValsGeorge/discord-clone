import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Servers } from 'src/app/models/server';
import { ServersService } from 'src/app/services/servers.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-servers-side-panel',
    templateUrl: './servers-side-panel.component.html',
    styleUrls: ['./servers-side-panel.component.css'],
})
export class ServersSidePanelComponent implements OnInit {
    selectedServerId: string | null = null;

    constructor(
        private serversService: ServersService,
        private utilsService: UtilsService
    ) {}
    servers: Servers[] = [];

    ngOnInit(): void {
        this.getServers();
        this.selectedServerId = this.utilsService.getSelectedServerId();
        this.serversService.serversUpdated$.subscribe(() => {
            this.getServers();
        });
    }

    highlightServer(serverId: string) {
        // When a server is clicked, highlight that server for better UX
        return this.selectedServerId === serverId;
    }

    selectServer(serverId: string) {
        // Save selected server to local storage
        this.selectedServerId = serverId;
        this.utilsService.setSelectedServerId(serverId);
        this.selectedServerId = this.utilsService.getSelectedServerId();
    }

    openCreateServer() {
        this.serversService.openDialog();
    }

    resetSelectedServer() {
        // Reset selected server to default
        this.selectedServerId = '0';
        this.utilsService.setSelectedServerId('0');
    }

    getServers() {
        this.serversService.getServers().subscribe(
            (response: any) => {
                this.servers = response;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
}
