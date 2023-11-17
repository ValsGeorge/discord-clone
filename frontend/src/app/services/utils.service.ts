import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    setSelectedServerId(serverId: string) {
        localStorage.setItem('selectedServerId', serverId);
    }

    getSelectedServerId(): string {
        return localStorage.getItem('selectedServerId') || '0';
    }
}
