import { Component } from '@angular/core';
import { LightdarkService } from 'src/app/services/lightdark.service';
import { OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'frontend';
    constructor(
        private lightdarkService: LightdarkService,
        private utilsService: UtilsService
    ) {}
    ngOnInit(): void {
        // Check if the user has a theme preference
        localStorage.getItem('isDarkMode') === 'true'
            ? this.lightdarkService.toggleTheme(true)
            : this.lightdarkService.toggleTheme(false);

        // Setup socket connection

        this.utilsService.setupSocketConnection();
    }

    toggleTheme(): void {
        const isDarkMode = !document.documentElement.classList.contains('dark');
        this.lightdarkService.toggleTheme(isDarkMode);
    }
}
