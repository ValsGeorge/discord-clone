import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ContextMenu } from 'src/app/models/contextMenu';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';

@Component({
    selector: 'app-online-users',
    templateUrl: './online-users.component.html',
    styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
    onlineUsers: User[] = [];
    onlineUsersIds: Set<string> = new Set();

    constructor(
        private authService: AuthService,
        private utilsService: UtilsService
    ) {}

    @ViewChildren(EditMenuComponent) editMenu!: QueryList<EditMenuComponent>;
    itemsList: ContextMenu[] = [
        {
            icon: 'pi pi-plus',
            label: 'Add Friend',
            action: 'add-friend',
        },
    ];
    showContextMenu(event: MouseEvent, userId: string): void {
        event.preventDefault();
        event.stopPropagation();

        this.editMenu.forEach((menu) => {
            if (menu.targetId === userId) {
                menu.showMenu = true;
            } else {
                menu.showMenu = false;
            }
        });
    }

    ngOnInit() {
        // Get all the active users
        const selectedServerId = this.utilsService.getSelectedServerId();
        if (selectedServerId) {
            const users = this.utilsService.getOnlineUsers();
            users.forEach((user) => {
                if (user.serverIds && !this.onlineUsersIds.has(user.id)) {
                    user.serverIds.forEach((serverId) => {
                        if (String(serverId) === String(selectedServerId)) {
                            this.onlineUsersIds.add(user.id);
                            this.onlineUsers.push(user);
                        }
                    });
                }
            });
        }

        // Subscribe to the online users subject to get updates when the online users change
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            onlineUsers.forEach((user) => {
                if (user.serverIds && !this.onlineUsersIds.has(user.id)) {
                    user.serverIds.forEach((serverId) => {
                        if (String(serverId) === String(selectedServerId)) {
                            this.onlineUsersIds.add(user.id);
                            this.onlineUsers.push(user);
                        }
                    });
                }
            });
        });
    }
}
