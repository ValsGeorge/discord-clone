import { Component, HostListener, Input } from '@angular/core';

@Component({
    selector: 'app-edit-menu',
    templateUrl: './edit-menu.component.html',
    styleUrls: ['./edit-menu.component.css'],
})
export class EditMenuComponent {
    @Input() targetId: string | undefined;
    @Input() itemsList: any[] | undefined;
    showMenu = false;

    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
        this.showMenu = false;
    }

    handleAction(action: string) {
        console.log(`Action for ${this.targetId}: ${action}`);
        this.showMenu = false;
    }

    setPosition(x: number, y: number) {
        const menuElement = document.getElementById('context-menu');
        if (menuElement) {
            menuElement.style.left = `${x}px`;
            menuElement.style.top = `${y}px`;
        }
    }
}
