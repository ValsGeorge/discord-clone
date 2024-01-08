import { Component, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServersService } from 'src/app/services/servers.service';
import { OnInit } from '@angular/core';
import { Servers } from 'src/app/models/server';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ContextMenu } from 'src/app/models/contextMenu';

@Component({
    selector: 'app-server-name-options',
    templateUrl: './server-name-options.component.html',
    styleUrls: ['./server-name-options.component.css'],
})
export class ServerNameOptionsComponent implements OnInit {
    @ViewChildren(EditMenuComponent) editMenu!: QueryList<EditMenuComponent>;
    constructor(
        private authService: AuthService,
        private serversService: ServersService
    ) {}

    server: Servers = {
        id: '',
        name: '',
        owner: '',
        members: [],
        chats: [],
        created_at: '',
        updated_at: '',
    };

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

    ngOnInit() {
        const serverId = localStorage.getItem('selectedServerId') as string;
        this.serversService.getServerInfo(serverId).subscribe((serverInfo) => {
            console.log(serverInfo);
            this.server = serverInfo;
            if (this.server.image)
                this.server.image =
                    this.serversService.getServerImageUrl(serverId);
        });
    }
}
