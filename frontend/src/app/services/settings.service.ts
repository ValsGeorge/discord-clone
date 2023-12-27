import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private showDialogSubject = new BehaviorSubject<boolean>(false);
    showDialogObservable = this.showDialogSubject.asObservable();

    openSettings() {
        console.log('openSettings');
        this.showDialogSubject.next(true);
    }

    closeSettings() {
        console.log('closeSettings');
        this.showDialogSubject.next(false);
    }
}
