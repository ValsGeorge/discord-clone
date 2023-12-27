import {
    Component,
    ComponentRef,
    HostListener,
    Input,
    ViewChildren,
} from '@angular/core';
import { ContextMenu } from 'src/app/models/contextMenu';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelsService } from 'src/app/services/channels/channels.service';
import { ServersService } from 'src/app/services/servers.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DirectMessagesService } from 'src/app/services/direct-messages/direct-messages.service';
import { Servers } from 'src/app/models/server';
import { SettingsService } from 'src/app/services/settings.service';
@Component({
    selector: 'app-edit-menu',
    templateUrl: './edit-menu.component.html',
    styleUrls: ['./edit-menu.component.css'],
})
export class EditMenuComponent {
    [x: string]: any;
    @Input() server: Servers = {
        id: '',
        name: '',
        owner: '',
        members: [],
        chats: [],
        created_at: '',
        updated_at: '',
    };
    @Input() targetId: string | undefined;
    @Input() itemsList: ContextMenu[] | undefined;

    @Input() width: number | undefined;
    @Input() marginX: number | undefined;
    @Input() marginY: number | undefined;

    showMenu = false;

    showDialog = false;

    constructor(
        private serversService: ServersService,
        private channelsService: ChannelsService,
        private authService: AuthService,
        private utilsService: UtilsService,
        private dmService: DirectMessagesService,
        private settingsComponent: SettingsService
    ) {}

    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
        this.showMenu = false;
    }

    handleAction(event: Event, action: string) {
        console.log(`Action for ${this.targetId}: ${action}`);
        this.showMenu = false;
        event.stopPropagation();

        switch (action) {
            case 'delete-server':
                this.handleDeleteServer();
                break;

            case 'edit-server':
                this.openSettings();
                // this.settingsComponent.openSettings();
                console.log('edit server');
                break;

            case 'delete-channel':
                this.handleDeleteChannel();
                break;

            case 'invite-to-server':
                this.handleInviteToServer();
                break;

            case 'edit-channel':
                console.log('edit channel');
                break;

            case 'edit-message':
                console.log('edit message');
                break;

            case 'delete-message':
                console.log('delete message');
                break;

            case 'add-friend':
                this.handleAddFriend();
                break;

            case 'remove-friend':
                console.log('remove friend');
                break;

            case 'add-dm':
                this.handleAddDM();
                break;

            default:
                console.log('Unknown action');
                break;
        }
    }

    handleDeleteServer() {
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

    handleDeleteChannel() {
        this.channelsService.deleteChannel(this.targetId as string).subscribe(
            (res) => {
                console.log(res);
                this.channelsService.updateChannels(this.targetId as string);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    handleInviteToServer() {
        this.serversService
            .generateInviteCode(this.targetId as string)
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
    }

    handleAddFriend() {
        console.log('add friend');
        console.log(this.targetId);
        if (this.utilsService.socket) {
            this.utilsService.socket.emit(
                'sendFriendRequest',
                {
                    senderId: this.authService.getUserId(),
                    receiverId: this.targetId,
                },
                (response: any) => {
                    if (!response.success) {
                        console.error('Failed to send friend request');
                    }
                }
            );
        }
    }

    handleAddDM() {
        this.dmService.addUserToDMList(this.targetId as string);
    }

    // openSettings() {
    //     console.log('open settings');
    //     this.settingsComponent.openSettings();
    // }

    openSettings() {
        console.log('openSettings');
        this.showDialog = true;
    }

    closeSettings() {
        console.log('closeSettings');
        this.showDialog = false;
    }

    setPosition(x: number, y: number) {
        const menuElement = document.getElementById('context-menu');
        if (menuElement) {
            menuElement.style.left = `${x}px`;
            menuElement.style.top = `${y}px`;
        }
    }
}
