import { Component } from '@angular/core';
import { ChannelsService } from '../../services/channels/channels.service';
import { OnInit } from '@angular/core';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
    constructor(
        private channelsService: ChannelsService,
        private utilsService: UtilsService
    ) {}

    channels: Channels[] = [];
    selectedServerId: string | null = null;
    ngOnInit(): void {
        this.getChannels();
    }

    getChannels() {
        // TODO: Get server id from url
        this.selectedServerId = this.utilsService.getSelectedServerId();
        this.channelsService.getChannels(this.selectedServerId).subscribe(
            (response) => {
                this.channels = response;
                console.log('Channels:', response);
            },
            (error) => {
                console.error('Error getting channels:', error);
            }
        );
    }

    openDialog() {
        this.channelsService.openDialog();
    }
}
