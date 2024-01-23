import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { OnInit } from '@angular/core';
import { Servers } from 'src/app/models/server';
import { ServersService } from 'src/app/services/servers.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ChannelsService } from 'src/app/services/channels/channels.service';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ContextMenu } from 'src/app/models/contextMenu';
@Component({
    selector: 'app-servers-side-panel',
    templateUrl: './servers-side-panel.component.html',
    styleUrls: ['./servers-side-panel.component.css'],
})
export class ServersSidePanelComponent implements OnInit {
    selectedServerId: string | null = null;
    @ViewChildren(EditMenuComponent) editMenu!: QueryList<EditMenuComponent>;

    constructor(
        private serversService: ServersService,
        private utilsService: UtilsService,
        private channelsService: ChannelsService
    ) {}
    servers: Servers[] = [];

    itemsList: ContextMenu[] = [
        {
            icon: 'pi pi-plus',
            label: 'Add Channel',
            action: 'add-channel',
        },
        {
            icon: 'pi pi-pencil',
            label: 'Edit Server',
            action: 'edit-server',
        },
        {
            icon: 'pi pi-trash',
            label: 'Delete Server',
            action: 'delete-server',
        },
        {
            icon: 'pi pi-share',
            label: 'Invite friend',
            action: 'invite-to-server',
        },
    ];

    ngOnInit(): void {
        this.getServers();
        this.selectedServerId = this.utilsService.getSelectedServerId();
        this.serversService.serversUpdated$.subscribe(() => {
            this.getServers();
        });
    }

    showContextMenu(event: MouseEvent, serverId: string): void {
        event.preventDefault();
        event.stopPropagation();

        this.editMenu.forEach((menu) => {
            if (menu.targetId === serverId) {
                menu.showMenu = true;
            } else {
                menu.showMenu = false;
            }
        });
    }

    highlightServer(serverId: string) {
        // When a server is clicked, highlight that server for better UX
        return this.selectedServerId === serverId;
    }

    selectServer(serverId: string) {
        console.log(`Selected server: ${serverId}`);
        // Save selected server to local storage
        this.selectedServerId = serverId;
        this.utilsService.setSelectedServerId(serverId);
        this.selectedServerId = this.utilsService.getSelectedServerId();
        this.utilsService.updateOnlineUsers();
        // Update channels
        this.channelsService.getChannels(this.selectedServerId).subscribe(
            (channels) => {
                this.channelsService.updateChannels(
                    this.selectedServerId || '0'
                ); // Notify about channel update
            },
            (error) => {
                console.error('Error getting channels:', error);
            }
        );
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
                this.servers.forEach((server) => {
                    if (server.image) {
                        server.image = this.serversService.getServerImageUrl(
                            server.id
                        );
                    }
                });
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    generateInviteCode() {
        const serverId = this.utilsService.getSelectedServerId();
        this.serversService.generateInviteCode(serverId).subscribe(
            (response: any) => {
                console.log(response);
                this.serversService.updateServers();
            },
            (error: any) => {
                console.log(error);
            }
        );
    }
}
