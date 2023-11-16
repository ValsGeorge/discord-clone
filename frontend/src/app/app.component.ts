import { Component } from '@angular/core';
import { LightdarkService } from 'src/app/services/lightdark.service';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'frontend';
    constructor(private lightdarkService: LightdarkService) {}
    ngOnInit(): void {
        // if (localStorage.getItem('isDarkMode') === 'false') {
        //     localStorage.setItem('isDarkMode', 'true');
        // }
        localStorage.getItem('isDarkMode') === 'true'
            ? this.lightdarkService.toggleTheme(true)
            : this.lightdarkService.toggleTheme(false);
    }

    toggleTheme(): void {
        const isDarkMode = !document.documentElement.classList.contains('dark');
        this.lightdarkService.toggleTheme(isDarkMode);
    }
}
