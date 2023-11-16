import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ChannelsService } from 'src/app/services/channels.service';

@Component({
    selector: 'app-create-server-popup',
    templateUrl: './create-server-popup.component.html',
    styleUrls: ['./create-server-popup.component.css'],
})
export class CreateServerPopupComponent {
    visible: boolean = false;
    serverNameForm: FormGroup;

    constructor(
        private channelsService: ChannelsService,
        private formBuilder: FormBuilder
    ) {
        this.channelsService.showDialogObservable.subscribe((response) => {
            this.visible = response;
        });
        this.serverNameForm = this.formBuilder.group({
            serverName: ['', Validators.required],
        });
    }

    confirm() {
        this.channelsService.createServer(this.serverNameForm.value).subscribe(
            (response) => {
                // Handle successful response
                console.log('Server created successfully:', response);
            },
            (error) => {
                // Handle error
                console.error('Error creating server:', error);
            }
        );

        this.serverNameForm.reset();
        this.channelsService.closeDialog();
    }

    close() {
        this.channelsService.closeDialog();
    }
}
