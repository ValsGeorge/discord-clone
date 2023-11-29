import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Channels } from 'src/app/models/channel';
import { ChannelsService } from 'src/app/services/channels/channels.service';

@Component({
    selector: 'app-create-channel-popup',
    templateUrl: './create-channel-popup.component.html',
    styleUrls: ['./create-channel-popup.component.css'],
})
export class CreateChannelPopupComponent {
    channelName: string = '';
    visible: boolean = false;
    channelForm: FormGroup;

    constructor(
        private channelsService: ChannelsService,
        private formBuilder: FormBuilder
    ) {
        this.channelsService.showDialogObservable.subscribe((response) => {
            this.visible = response;
        });
        this.channelForm = this.formBuilder.group({
            id: null,
            name: [''],
            type: ['text'],
            created_at: null,
            updated_at: null,
        });
    }

    confirm() {
        const formData: Channels = this.channelForm.value;
        this.channelsService.createChannel(formData).subscribe(
            (response) => {
                console.log('Channel created successfully:', response);
                this.channelsService.updateChannels(
                    this.channelsService.selectedServerId || '0'
                );
            },
            (error) => {
                console.error('Error creating channel:', error);
            }
        );

        this.channelForm.reset();
        this.channelsService.closeDialog();
        this.channelForm = this.formBuilder.group({
            id: null,
            name: [''],
            type: ['text'],
            created_at: null,
            updated_at: null,
        });
    }

    close() {
        this.channelsService.closeDialog();
    }
}
