import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from '../utils.service';

interface DialogData {
    categoryId: string;
    serverId: string;
    visible: boolean;
}
@Injectable({
    providedIn: 'root',
})
export class ChannelsService {
    constructor(private http: HttpClient, private utilsService: UtilsService) {}

    private showDialogSubject = new BehaviorSubject<boolean>(false);
    showDialogObservable = this.showDialogSubject.asObservable();

    private channelsUpdatedSubject = new Subject<void>();
    channelsUpdated$ = this.channelsUpdatedSubject.asObservable();

    private selectedCategoryId: string | null = null;
    selectedCategoryIdObservable = new BehaviorSubject<string | null>(null);

    baseUrl = 'http://localhost:8000/channels';
    selectedServerId: string | null = null;

    private dialogDataSubject = new BehaviorSubject<DialogData | null>(null);
    dialogData$: Observable<DialogData | null> =
        this.dialogDataSubject.asObservable();

    openDialog(dialogData: DialogData): void {
        console.log('DialogData:', dialogData);

        // Set the dialog data and notify subscribers
        this.dialogDataSubject.next(dialogData);
    }

    closeDialog() {
        console.log('close dialog');
        this.dialogDataSubject.next({
            categoryId: '',
            serverId: '',
            visible: false,
        });
    }

    updateChannels(serverId: string) {
        this.channelsUpdatedSubject.next();
    }

    createChannel(channel: Channels): Observable<any> {
        const url = `${this.baseUrl}/`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        this.selectedServerId = this.utilsService.getSelectedServerId();
        const data = {
            name: channel.name,
            type: channel.type,
            categoryId: channel.category,
            serverId: this.selectedServerId,
        };
        this.updateChannels(this.selectedServerId || '0');

        return this.http.post(url, data, { withCredentials: true });
    }

    getChannels(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/${serverId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { withCredentials: true });
    }

    deleteChannel(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/${channelId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };

        this.updateChannels(this.selectedServerId || '0');

        return this.http.delete(url, { withCredentials: true });
    }

    getChannelInfo(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/info/${channelId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { withCredentials: true });
    }

    updateChannelsOrder(channels: Channels[]): Observable<any> {
        const url = `${this.baseUrl}/update-order`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        const body = {
            channels: channels,
        };
        return this.http.put(url, body, { headers });
    }
}
