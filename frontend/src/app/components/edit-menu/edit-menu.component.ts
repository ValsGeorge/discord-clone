import { Component, HostListener, Input } from '@angular/core';
import { ContextMenu } from 'src/app/models/contextMenu';
import { ChannelsService } from 'src/app/services/channels/channels.service';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-edit-menu',
    templateUrl: './edit-menu.component.html',
    styleUrls: ['./edit-menu.component.css'],
})
export class EditMenuComponent {
    [x: string]: any;
    @Input() targetId: string | undefined;
    @Input() itemsList: ContextMenu[] | undefined;
    showMenu = false;

    constructor(
        private serversService: ServersService,
        private channelsService: ChannelsService
    ) {}

    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
        this.showMenu = false;
    }

    handleAction(event: Event, action: string) {
        console.log(`Action for ${this.targetId}: ${action}`);
        this.showMenu = false;
        event.stopPropagation();

        if (action === 'delete-server') {
            this.serversService.deleteServer(this.targetId as string).subscribe(
                (res) => {
                    console.log(res);
                    this.serversService.updateServers();
                },
                (err) => {
                    console.log(err);
                }
            );
        } else if (action === 'edit-server') {
            console.log('edit server');
        } else if (action === 'delete-channel') {
            this.channelsService
                .deleteChannel(this.targetId as string)
                .subscribe(
                    (res) => {
                        console.log(res);
                        this.channelsService.updateChannels(
                            this.targetId as string
                        );
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        } else if (action === 'edit-channel') {
            console.log('edit channel');
        } else if (action === 'edit-message') {
            console.log('edit message');
        } else if (action === 'delete-message') {
            console.log('delete message');
        }
    }

    setPosition(x: number, y: number) {
        const menuElement = document.getElementById('context-menu');
        if (menuElement) {
            menuElement.style.left = `${x}px`;
            menuElement.style.top = `${y}px`;
        }
    }
}
