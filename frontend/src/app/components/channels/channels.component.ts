import { Component } from '@angular/core';
import { ChannelsService } from '../../services/channels/channels.service';
import { OnInit } from '@angular/core';
import { Channels } from 'src/app/models/channel';
@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
    channelName: string = '';
    serverId!: string;

    constructor(private channelsService: ChannelsService) {}
    channels: Channels[] = [];
    ngOnInit(): void {
        this.getChannels();
    }

    createChannel() {
        this.channelsService
            .createChannel(this.channelName, this.serverId)
            .subscribe(
                (response) => {
                    console.log('Channel created successfully:', response);
                },
                (error) => {
                    console.error('Error creating channel:', error);
                }
            );
    }

    getChannels() {
        // TODO: Get server id from url
        this.channelsService.getChannels('1').subscribe(
            (response) => {
                this.channels = response;
                console.log('Channels:', response);
            },
            (error) => {
                console.error('Error getting channels:', error);
            }
        );
    }
}
