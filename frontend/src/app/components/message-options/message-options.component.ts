import { Component, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-message-options',
    templateUrl: './message-options.component.html',
    styleUrls: ['./message-options.component.css'],
})
export class MessageOptionsComponent {
    constructor() {}

    showOptions = false;

    @Input() message: any | undefined;
    @Output() editClick = new EventEmitter<void>();

    editMessage(): void {
        console.log('edit message');
        this.editClick.emit();
    }

    deleteMessage(): void {
        console.log('delete message');
    }
}
