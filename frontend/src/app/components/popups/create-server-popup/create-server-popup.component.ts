import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-create-server-popup',
    templateUrl: './create-server-popup.component.html',
    styleUrls: ['./create-server-popup.component.css'],
})
export class CreateServerPopupComponent {
    visible: boolean = false;
    serverNameForm: FormGroup;

    constructor(
        private serversService: ServersService,
        private formBuilder: FormBuilder
    ) {
        this.serversService.showDialogObservable.subscribe((response) => {
            this.visible = response;
        });
        this.serverNameForm = this.formBuilder.group({
            serverName: ['', Validators.required],
        });
    }

    confirm() {
        this.serversService.createServer(this.serverNameForm.value).subscribe(
            (response) => {
                this.serversService.updateServers();
            },
            (error) => {
                console.error('Error creating server:', error);
            }
        );

        this.serverNameForm.reset();
        this.serversService.closeDialog();
    }

    close() {
        this.serversService.closeDialog();
    }
}
