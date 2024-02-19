import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Channels } from 'src/app/models/channel';

@Component({
    selector: 'app-channels-settings',
    templateUrl: './channels-settings.component.html',
    styleUrls: ['./channels-settings.component.css'],
})
export class ChannelsSettingsComponent {
    @Input() visible: boolean = false;
    @Input() channel: Channels = {
        id: '',
        name: '',
        messages: [],
        category: '',
        server: '',
        created_at: '',
        updated_at: '',
        order: 0,
        type: '',
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

    ngOnInit(): void {
        this.selectedOption = 'Overview';
    }
    confirm() {}

    onClose() {
        this.close.emit();
    }

    selectOption(option: string) {
        this.selectedOption = option;
    }
}
