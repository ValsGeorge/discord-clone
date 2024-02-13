import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Servers } from 'src/app/models/server';
import { ServersService } from 'src/app/services/servers.service';

@Component({
    selector: 'app-server-settings',
    templateUrl: './server-settings.component.html',
    styleUrls: ['./server-settings.component.css'],
})
export class ServerSettingsComponent {
    @ViewChild('fileInput') fileInput!: ElementRef;
    @Input() visible: boolean = false;
    @Input() server: Servers = {
        id: '',
        name: '',
        owner: '',
        members: [],
        chats: [],
        created_at: '',
        updated_at: '',
        image: '',
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

    constructor(private serversService: ServersService) {
        this.selectedOption = 'Overview';
    }
    confirm() {}

    onClose() {
        this.close.emit();
    }

    selectOption(option: string) {
        this.selectedOption = option;
    }

    onFileSelected(event: any) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (file) {
            this.serversService
                .uploadServerImage(this.server.id, file)
                .subscribe((response) => {
                    this.serversService.updateServers();
                });
        }
    }

    uploadImage() {
        this.fileInput.nativeElement.click();
    }
}
