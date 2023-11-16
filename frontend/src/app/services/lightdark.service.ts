import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LightdarkService {
    toggleTheme(isDarkMode: boolean): void {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('isDarkMode', isDarkMode.toString());
    }
}
