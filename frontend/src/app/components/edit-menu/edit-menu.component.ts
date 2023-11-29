import { Component, HostListener, Input } from '@angular/core';
import { ContextMenu } from 'src/app/models/contextMenu';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-edit-menu',
    templateUrl: './edit-menu.component.html',
    styleUrls: ['./edit-menu.component.css'],
})
export class EditMenuComponent {
    @Input() targetId: string | undefined;
    @Input() itemsList: ContextMenu[] | undefined;
    showMenu = false;

    constructor(private serversService: ServersService) {}

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
