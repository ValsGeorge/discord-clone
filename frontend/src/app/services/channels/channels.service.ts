import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from '../utils.service';

@Injectable({
    providedIn: 'root',
})
export class ChannelsService {
    constructor(private http: HttpClient, private utilsService: UtilsService) {}

    private showDialogSubject = new BehaviorSubject<boolean>(false);
    showDialogObservable = this.showDialogSubject.asObservable();

    private channelsUpdatedSubject = new Subject<void>();
    channelsUpdated$ = this.channelsUpdatedSubject.asObservable();

    selectedServerId: string | null = null;

    baseUrl = 'http://localhost:8000/channels';

    openDialog() {
        console.log('open dialog');
        this.showDialogSubject.next(true);
    }

    closeDialog() {
        console.log('close dialog');
        this.showDialogSubject.next(false);
    }

    updateChannels(serverId: string) {
        this.channelsUpdatedSubject.next();
        // Optionally, you can also call getChannels here to fetch updated channels immediately
        this.getChannels(serverId).subscribe(
            (channels) => {
                // Update channels array or any other logic here
                console.log('Channels:', channels);
            },
            (error) => {
                console.error('Error getting channels:', error);
            }
        );
    }

    createChannel(channel: Channels): Observable<any> {
        const url = `${this.baseUrl}/create`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        this.selectedServerId = this.utilsService.getSelectedServerId();
        const data = {
            name: channel.name,
            type: channel.type,
            serverId: this.selectedServerId,
        };

        this.updateChannels(this.selectedServerId || '0');

        return this.http.post(url, data, { headers });
    }

    getChannels(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/get-channels/${serverId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { headers });
    }
}
