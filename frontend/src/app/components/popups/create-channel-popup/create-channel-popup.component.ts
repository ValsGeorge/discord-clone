import { Component, Input } from '@angular/core';
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
    categoryId: string | null = null;
    serverId: string | null = null;
    channelForm: FormGroup;
    constructor(
        private channelsService: ChannelsService,
        private formBuilder: FormBuilder
    ) {
        this.channelsService.dialogData$.subscribe((dialogData) => {
            if (dialogData) {
                this.visible = dialogData.visible;
                this.categoryId = dialogData.categoryId;
                this.serverId = dialogData.serverId;
            }
        });
        this.channelsService.selectedCategoryIdObservable.subscribe(
            (response) => {
                console.log('response2:', response);
                this.categoryId = response;
            }
        );
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
        if (this.categoryId) formData.categoryId = this.categoryId;

        this.channelsService.createChannel(formData).subscribe(
            (response) => {},
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
            categoryId: this.categoryId,
            serverId: this.serverId,
            created_at: null,
            updated_at: null,
        });
    }

    close() {
        this.channelsService.closeDialog();
    }
}
