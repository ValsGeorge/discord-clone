import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ContextMenu } from 'src/app/models/contextMenu';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
    friends: User[] = [];
    onlineFriends: User[] = [];
    onlineUsers: User[] = [];
    friendRequests: User[] = [];

    selectedTab = 'online';

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
    constructor(
        private authService: AuthService,
        private utilsService: UtilsService,
        private chatService: ChatService,
        private router: Router
    ) {
        this.utilsService.onlineUsers$.subscribe((onlineUsers) => {
            this.onlineFriends = onlineUsers;
        });
    }

    ngOnInit(): void {
        this.getOnlineFriends();
        this.authService.getFriendRequests().subscribe((friendRequests) => {
            console.log('Friend requests:', friendRequests);
            this.friendRequests = friendRequests;
        });

        this.utilsService.onlineFriends$.subscribe((onlineFriends) => {
            this.onlineFriends = onlineFriends;
        });

        this.utilsService.friendRequests$.subscribe((friendRequests) => {
            console.log('Friend requests:', friendRequests);
            this.friendRequests = friendRequests;
        });
    }

    getOnlineFriends(): void {
        this.onlineFriends = this.utilsService.getOnlineFriends();
    }

    openPrivateChat(user: User): void {
        if (user.id === this.authService.getUserId()) {
            this.router.navigate(['/servers']);
            return;
        }
        this.chatService.fetchInitialDMs(this.authService.getUserId(), user.id);
        this.router.navigate(['/servers/chat-dm', user.id]);
    }

    getSelectedTab(): string {
        return this.selectedTab;
    }

    setSelectedTab(tab: string): void {
        this.selectedTab = tab;
    }

    respondFriendRequest(
        requesterId: string,
        status: 'accept' | 'decline'
    ): void {
        this.authService
            .respondFriendRequest(
                requesterId,
                this.authService.getUserId(),
                status
            )
            .subscribe((res) => {
                console.log('Friend request accepted:', res);
                this.authService
                    .getFriendRequests()
                    .subscribe((friendRequests) => {
                        console.log('Friend requests:', friendRequests);
                        this.friendRequests = friendRequests;
                    });
            });
    }
}
