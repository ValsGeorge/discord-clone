import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, tap } from 'rxjs';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from '../utils.service';
import { environment } from 'src/environments/environment';

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

    channels: Channels[] = [];

    baseUrl = `${environment.baseUrl}/channels`;
    selectedServerId: string | null = null;

    private dialogDataSubject = new BehaviorSubject<DialogData | null>(null);
    dialogData$: Observable<DialogData | null> =
        this.dialogDataSubject.asObservable();

    openDialog(dialogData: DialogData): void {
        // Set the dialog data and notify subscribers
        this.dialogDataSubject.next(dialogData);
    }

    closeDialog() {
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
        this.selectedServerId = this.utilsService.getSelectedServerId();
        const data = {
            name: channel.name,
            type: channel.type,
            category: channel.category,
            server: this.selectedServerId,
        };

        return this.http.post(url, data, { withCredentials: true }).pipe(
            tap((response: any) => {
                this.channels.push(response);
                this.updateChannels(this.selectedServerId || '0');
                return response;
            }),
            catchError((error) => {
                throw error;
            })
        );
    }

    getChannels(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/${serverId}`;

        // check if the channels already has the serverId
        const index = this.channels.findIndex(
            (channel) => channel.server === serverId
        );
        if (index !== -1) {
            const newChannels = this.channels.filter(
                (channel) => channel.server === serverId
            );
            return new Observable((observer) => {
                observer.next(newChannels);
                observer.complete();
            });
        }

        return this.http.get<Channels[]>(url, { withCredentials: true }).pipe(
            tap((response: Channels[]) => {
                // check if the channels already has the serverId
                const index = this.channels.findIndex(
                    (channel) => channel.server === serverId
                );
                if (index === -1) {
                    response.forEach((channel) => {
                        this.channels.push(channel);
                    });
                }
                return response;
            }),
            catchError((error) => {
                throw error;
            })
        );
    }

    deleteChannel(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/${channelId}`;

        this.updateChannels(this.selectedServerId || '0');

        return this.http.delete(url, { withCredentials: true });
    }

    getChannelInfo(channelId: string): Observable<any> {
        const url = `${this.baseUrl}/info/${channelId}`;
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
