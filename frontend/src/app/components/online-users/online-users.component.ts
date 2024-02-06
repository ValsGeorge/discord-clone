import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ContextMenu } from 'src/app/models/contextMenu';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-online-users',
    templateUrl: './online-users.component.html',
    styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
    onlineUsers: User[] = [];
    onlineUsersIds: Set<string> = new Set();

    serverMembers: User[] = [];

    constructor(
        private authService: AuthService,
        private utilsService: UtilsService,
        private serversService: ServersService
    ) {}

    @ViewChildren(EditMenuComponent) editMenu!: QueryList<EditMenuComponent>;
    itemsList: ContextMenu[] = [
        {
            icon: 'pi pi-plus',
            label: 'Add Friend',
            action: 'add-friend',
        },
        {
            icon: 'pi pi-plus',
            label: 'Add DM',
            action: 'add-dm',
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
            console.log('this got called:', onlineUsers);
            this.onlineUsers = [];
            this.onlineUsersIds = new Set();
            this.serverMembers = [];
            const selectedServerId = this.utilsService.getSelectedServerId();
            onlineUsers.forEach((user) => {
                // if online and in the server, add it to the online users list
                if (user.serverIds && !this.onlineUsersIds.has(user.id)) {
                    user.serverIds.forEach((serverId) => {
                        if (String(serverId) === String(selectedServerId)) {
                            this.onlineUsersIds.add(user.id);
                            this.onlineUsers.push(user);
                        }
                    });
                }
            });
            // Get all members of the server
            this.serversService
                .getServerMembers(selectedServerId)
                .subscribe((members) => {
                    console.log('Server members:', members);

                    // for each member, check if it is online using onlineUserIds
                    members.map((member: any) => {
                        if (!this.onlineUsersIds.has(member.id)) {
                            member.profilePicture =
                                this.authService.getProfilePictureUrl(
                                    member.id
                                );
                            this.serverMembers.push(member);
                        }
                    });
                });
        });
    }
}
