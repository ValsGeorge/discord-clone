import { Component } from '@angular/core';
import { ChannelsService } from '../../services/channels/channels.service';
import { OnInit } from '@angular/core';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from 'src/app/services/utils.service';
import { ChatService } from 'src/app/services/chat/chat.service';
@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
    constructor(
        private channelsService: ChannelsService,
        private utilsService: UtilsService,
        private chatService: ChatService
    ) {}

    channels: Channels[] = [];
    selectedServerId: string | null = null;
    selectedChannelId: string | null = null;
    ngOnInit(): void {
        this.getChannels();
        this.selectedChannelId = this.utilsService.getSelectedChannelId();
        this.channelsService.channelsUpdated$.subscribe(() => {
            this.getChannels();
        });
    }

    getChannels() {
        this.selectedServerId = this.utilsService.getSelectedServerId();
        this.channelsService.getChannels(this.selectedServerId).subscribe(
            (response) => {
                this.channels = response;
            },
            (error) => {
                console.error('Error getting channels:', error);
            }
        );
    }

    openDialog() {
        this.channelsService.openDialog();
    }

    selectChannel(channelId: string) {
        this.utilsService.setSelectedChannelId(channelId);
        this.selectedChannelId = this.utilsService.getSelectedChannelId();
        this.chatService.getMessages(this.selectedChannelId).subscribe(
            (response) => {
                this.chatService.updateChat(this.selectedChannelId || '0');
            },
            (error) => {
                console.error('Error getting messages:', error);
            }
        );
    }
}
