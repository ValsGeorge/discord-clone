import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
    selector: 'app-category-settings',
    templateUrl: './category-settings.component.html',
    styleUrls: ['./category-settings.component.css'],
})
export class CategorySettingsComponent implements OnInit {
    @Input() visible: boolean = false;
    @Input() category: Category = {
        id: '',
        name: '',
        channels: [],
        server: '',
        created_at: '',
        updated_at: '',
        order: 0,
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

    handleModalClick(event: Event) {
        // Stop event propagation to prevent clicks on the modal from reaching underlying elements
        event.stopPropagation();
    }
}
