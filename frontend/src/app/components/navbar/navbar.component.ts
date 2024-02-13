import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
    isSidePanelOpen = false;

    toggleSidePanel() {
        this.isSidePanelOpen = !this.isSidePanelOpen;
    }

    @ViewChild('sidePanel') sidePanel: ElementRef | undefined;

    @HostListener('document:click', ['$event'])
    closeSidePanel(event: Event): void {
        const target = event.target as HTMLElement;
        if (this.sidePanel) {
            const isInside = this.sidePanel.nativeElement.contains(target);

            if (
                this.isSidePanelOpen &&
                !isInside &&
                !target.closest('#menuToggle')
            ) {
                this.isSidePanelOpen = false;
            }
        }
    }
}
