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
    title = 'Discord-Clone';
    constructor(
        private lightdarkService: LightdarkService,
        private utilsService: UtilsService
    ) {}
    ngOnInit(): void {
        // Check if the user has a theme preference
        localStorage.getItem('themeColor') === 'dark'
            ? this.lightdarkService.toggleTheme('dark')
            : this.lightdarkService.toggleTheme('light');

        // Setup socket connection

        this.utilsService.setupSocketConnection();
    }

    toggleTheme(color: string): void {
        this.lightdarkService.toggleTheme(color);
    }
}
