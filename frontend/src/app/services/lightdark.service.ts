import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LightdarkService {
    toggleTheme(themeColor: string): void {
        const root = document.documentElement;
        root.classList.add(themeColor);
        localStorage.setItem('themeColor', themeColor);
    }
}
