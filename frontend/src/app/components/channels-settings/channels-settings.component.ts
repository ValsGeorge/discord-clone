import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Channels } from 'src/app/models/channel';
import { ChannelsService } from 'src/app/services/channels/channels.service';

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
        description: '',
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

    channelSettingsForm: FormGroup;
    isFormEdited: boolean = false;
    originalChannel: Channels = {
        id: '',
        name: '',
        description: '',
        messages: [],
        category: '',
        server: '',
        created_at: '',
        updated_at: '',
        order: 0,
        type: '',
    };

    constructor(
        private fb: FormBuilder,
        private channelsService: ChannelsService
    ) {
        this.channelSettingsForm = this.fb.group({
            name: [''],
            description: [''],
        });

        if (this.channel) {
            this.channelSettingsForm.patchValue({
                name: this.channel.name,
                description: this.channel.description,
            });
        }
    }

    ngOnInit(): void {
        this.selectedOption = 'Overview';
        if (this.channel) {
            this.originalChannel = { ...this.channel };
            this.channelSettingsForm.patchValue({
                name: this.channel.name,
                description: this.channel.description,
            });
        }
        const nameControl = this.channelSettingsForm.get('name');
        if (nameControl) {
            nameControl.valueChanges.subscribe((value) => {
                if (value === '' || value === undefined)
                    this.channel.name = 'No name';
                else this.channel.name = value;
            });
        }
        this.channelSettingsForm.valueChanges.subscribe((values) => {
            const isNameSame = values.name === this.originalChannel.name;
            const isDescriptionSame =
                values.description === this.originalChannel.description;

            this.isFormEdited = !(isNameSame && isDescriptionSame);
        });
    }
    resetForm() {
        this.channelSettingsForm.reset({
            name: this.originalChannel.name,
            description: this.originalChannel.description,
        });
        this.isFormEdited = false;
    }
    confirm() {}

    onClose() {
        this.resetForm();
        this.close.emit();
    }

    selectOption(option: string) {
        this.selectedOption = option;
    }

    onSubmit() {
        if (this.channelSettingsForm.valid) {
            this.channelsService
                .editChannel(this.channel.id, this.channelSettingsForm.value)
                .subscribe(
                    (response) => {
                        this.channel = response;
                        this.originalChannel = { ...this.channel };
                        this.isFormEdited = false;
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
    }

    handleModalClick(event: Event) {
        event.stopPropagation();
    }
}
