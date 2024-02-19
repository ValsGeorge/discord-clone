import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    categorySettingsForm: FormGroup;
    isFormEdited: boolean = false;
    originalCategory: Category = {
        id: '',
        name: '',
        channels: [],
        server: '',
        created_at: '',
        updated_at: '',
        order: 0,
    };

    constructor(
        private fb: FormBuilder,
        private categoriesService: CategoriesService
    ) {
        this.categorySettingsForm = this.fb.group({
            name: [''],
        });

        if (this.category) {
            this.categorySettingsForm.patchValue({
                name: this.category.name,
            });
        }
    }

    ngOnInit(): void {
        this.selectedOption = 'Overview';
        if (this.category) {
            this.originalCategory = { ...this.category };
            this.categorySettingsForm.patchValue({
                name: this.category.name,
            });
        }
        const nameControl = this.categorySettingsForm.get('name');
        if (nameControl) {
            nameControl.valueChanges.subscribe((value) => {
                if (value === '' || value === undefined)
                    this.category.name = 'No name';
                else this.category.name = value;
            });
        }
        this.categorySettingsForm.valueChanges.subscribe((values) => {
            const isNameSame = values.name === this.originalCategory.name;

            this.isFormEdited = !isNameSame;
        });
    }
    resetForm() {
        this.categorySettingsForm.reset({
            name: this.originalCategory.name,
        });
        this.isFormEdited = false;
    }

    onSubmit() {
        if (this.categorySettingsForm.valid) {
            this.categoriesService
                .editCategory(this.category.id, this.categorySettingsForm.value)
                .subscribe(
                    (response) => {
                        this.category = response;
                        this.originalCategory = { ...this.category };
                        this.isFormEdited = false;
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
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
