import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Servers } from 'src/app/models/server';

@Component({
    selector: 'app-server-settings',
    templateUrl: './server-settings.component.html',
    styleUrls: ['./server-settings.component.css'],
})
export class ServerSettingsComponent {
    @Input() visible: boolean = false;
    @Input() server: Servers = {
        id: '',
        name: '',
        owner: '',
        members: [],
        chats: [],
        created_at: '',
        updated_at: '',
    };
    @Output() close: EventEmitter<void> = new EventEmitter<void>();
    options: string[] = [
        'Overview',
        'Roles',
        'Emoji',
        'Stickers',
        'Soundboard',
        'Widget',
        'Server Templates',
        'Custom Invite Link',
    ];
    selectedOption: string = 'Overview';
    hovered: boolean = false;

    constructor() {
        this.selectedOption = 'Overview';
    }
    confirm() {
        console.log('confirm');
    }

    onClose() {
        console.log('close');
        this.close.emit();
    }

    selectOption(option: string) {
        console.log(option);
        this.selectedOption = option;
    }

    onFileSelected(event: any) {
        console.log(event);
    }

    changeImage() {
        // TODO: Implement image change logic
        console.log('Change Image Clicked');
    }
}
