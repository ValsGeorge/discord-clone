import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ContextMenu } from 'src/app/models/contextMenu';
import { DirectMessagesService } from 'src/app/services/direct-messages/direct-messages.service';
import { DmList } from 'src/app/models/dmList';

@Component({
    selector: 'app-direct-messages',
    templateUrl: './direct-messages.component.html',
    styleUrls: ['./direct-messages.component.css'],
})
export class DirectMessagesComponent implements OnInit {
    onlineUsers: User[] = [];
    dmList: DmList[] = [];
    currentUser: User = {
        id: '',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    };
    onlineUserIds = new Set<string>();

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

    constructor(
        private authService: AuthService,
        private utilsService: UtilsService,
        private chatService: ChatService,
        private dmService: DirectMessagesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getDMList();
        this.onlineUsers = this.utilsService.getOnlineUsers();
        this.onlineUserIds = new Set(this.onlineUsers.map((user) => user.id));
        this.dmService.userList$.subscribe((user) => {
            this.dmList = this.dmList.concat(user);
            console.log('this.dmList', this.dmList);
        });
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineUserIds = new Set(onlineUsers.map((user) => user.id));
        });
    }

    getDMList(): void {
        this.dmService.getDMList().subscribe(
            (dmList) => {
                console.log('DM List:', dmList);
                // add the users to the DM list
                this.dmList = dmList;
                this.dmList.forEach((dm) => {
                    dm.user.profilePicture =
                        this.authService.getProfilePictureUrl(dm.user.id);
                });
            },
            (error) => {
                console.error('Error fetching DM list:', error);
            }
        );
    }

    openPrivateChat(user: User): void {
        if (user.id === this.authService.getUserId()) {
            this.router.navigate(['/servers']);
            return;
        }
        this.chatService.fetchInitialDMs(this.authService.getUserId(), user.id);
        this.router.navigate(['/servers/chat-dm', user.id]);
    }

    removeUserFromDMList(dmListId: string): void {
        console.log('Removing user from DM list:', dmListId);
        this.dmService.removeUserFromDMList(dmListId).subscribe(
            (response) => {
                console.log('User removed from DM list:', response);
                this.dmList = this.dmList.filter((dm) => dm.id !== dmListId);
            },
            (error) => {
                console.error('Error removing user from DM list:', error);
            }
        );
    }
}
