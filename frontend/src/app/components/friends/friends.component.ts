import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import { ContextMenu } from 'src/app/models/contextMenu';
import { FriendsService } from 'src/app/services/friends/friends.service';
import { FriendRequestsService } from 'src/app/services/friendRequests/friend-requests.service';
import { FriendRequest, Friend } from '../../models/friends';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
    friends: Friend[] = [];
    onlineFriends: Friend[] = [];
    friendRequests: FriendRequest[] = [];
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
        private router: Router,
        private friendsService: FriendsService,
        private friendRequestsService: FriendRequestsService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Biscord | Friends');
    }

    ngOnInit(): void {
        // Get the initial list of online users
        this.getOnlineFriends();
        this.friendRequestsService
            .getFriendRequests()
            .subscribe((friendRequests) => {
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
            this.friendRequests.forEach((request) => {
                request.from.profilePicture =
                    this.authService.getProfilePictureUrl(request.from.id);
            });
        });

        this.friendsService.getFriends().subscribe((friends) => {
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
        friendRequestId: string,
        status: 'accept' | 'decline'
    ): void {
        this.friendRequestsService
            .respondFriendRequest(friendRequestId, status)
            .subscribe((res) => {
                this.friendRequestsService
                    .getFriendRequests()
                    .subscribe((friendRequests) => {
                        this.friendRequests = friendRequests;
                    });
            });
    }
}
