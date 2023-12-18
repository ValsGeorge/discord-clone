import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ContextMenu } from 'src/app/models/contextMenu';
import { DirectMessagesService } from 'src/app/services/direct-messages/direct-messages.service';

@Component({
    selector: 'app-direct-messages',
    templateUrl: './direct-messages.component.html',
    styleUrls: ['./direct-messages.component.css'],
})
export class DirectMessagesComponent implements OnInit {
    onlineUsers: User[] = [];
    dmList: User[] = [];
    currentUser: User = {
        id: '',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    };

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
        this.getOnlineUsers();
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineUsers = onlineUsers;
        });
        this.dmService.getDMList().subscribe(
            (dmList) => {
                console.log('DM List:', dmList);
                // add the users to the DM list
                if (Array.isArray(dmList)) {
                    this.dmList = dmList;
                } else {
                    // If it's a single object, wrap it in an array
                    this.dmList = [dmList];
                }
            },
            (error) => {
                console.error('Error fetching DM list:', error);
            }
        );
    }
    getOnlineUsers(): void {
        this.onlineUsers = this.utilsService.getOnlineUsers();
    }

    openPrivateChat(user: User): void {
        if (user.id === this.authService.getUserId()) {
            this.router.navigate(['/servers']);
            return;
        }
        this.chatService.fetchInitialDMs(this.authService.getUserId(), user.id);
        this.router.navigate(['/servers/chat-dm', user.id]);
    }
}
