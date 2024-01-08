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
        console.log('update channels');
        console.log('serverId:', serverId);
        this.channelsUpdatedSubject.next();
        // this.getChannels(serverId).subscribe(
        //     (channels) => {

        //     },
        //     (error) => {
        //         console.error('Error getting channels:', error);
        //     }
        // );
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
            categoryId: channel.categoryId,
            serverId: this.selectedServerId,
        };
        this.updateChannels(this.selectedServerId || '0');

        return this.http.post(url, data, { headers });
    }

    getChannels(serverId: string): Observable<any> {
        console.log('get channels');
        const url = `${this.baseUrl}/get-channels/${serverId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { headers });
    }

    deleteChannel(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/${channelId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };

        this.updateChannels(this.selectedServerId || '0');

        return this.http.delete(url, { headers });
    }

    getChannelInfo(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/info/${channelId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { headers });
    }
}
