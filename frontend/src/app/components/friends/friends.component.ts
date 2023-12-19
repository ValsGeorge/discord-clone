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
    friendRequests: User[] = [];
    onlineFriendsIds = new Set<string>();

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
    ) {}

    ngOnInit(): void {
        // Get the initial list of online users
        this.getOnlineFriends();
        this.authService.getFriendRequests().subscribe((friendRequests) => {
            this.friendRequests = friendRequests;
        });

        // Subscribe to the online users list for updates
        this.utilsService.onlineFriends$.subscribe((onlineFriends) => {
            this.onlineFriends = onlineFriends;
            this.onlineFriendsIds = new Set(
                this.onlineFriends.map((user) => user.id)
            );
        });

        this.utilsService.friendRequests$.subscribe((friendRequests) => {
            this.friendRequests = friendRequests;
        });

        this.authService.getFriends().subscribe((friends) => {
            this.friends = friends;
        });
    }

    getOnlineFriends(): void {
        this.onlineFriends = this.utilsService.getOnlineFriends();
        this.onlineFriendsIds = new Set(
            this.onlineFriends.map((user) => user.id)
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
