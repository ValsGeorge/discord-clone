import { Component, QueryList, ViewChildren } from '@angular/core';
import { ChannelsService } from '../../services/channels/channels.service';
import { OnInit } from '@angular/core';
import { Channels } from 'src/app/models/channel';
import { UtilsService } from 'src/app/services/utils.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ContextMenu } from 'src/app/models/contextMenu';
import { EditMenuComponent } from '../edit-menu/edit-menu.component';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories/categories.service';
@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.css'],
})
export class ChannelsComponent implements OnInit {
    constructor(
        private channelsService: ChannelsService,
        private utilsService: UtilsService,
        private chatService: ChatService,
        private categoriesService: CategoriesService
    ) {}

    channels: Channels[] = [];

    categories: Category[] = [];

    selectedServerId: string | null = null;
    selectedChannelId: string | null = null;

    @ViewChildren(EditMenuComponent) editMenu!: QueryList<EditMenuComponent>;
    itemsList: ContextMenu[] = [
        {
            icon: 'pi pi-pencil',
            label: 'Edit Channel',
            action: 'edit-channel',
        },
        {
            icon: 'pi pi-trash',
            label: 'Delete Channel',
            action: 'delete-channel',
        },
    ];

    ngOnInit(): void {
        this.getCategories();
        // this.getChannels();
        this.selectedChannelId = this.utilsService.getSelectedChannelId();
        // this.channelsService.channelsUpdated$.subscribe(() => {
        //     this.getChannels();
        // });
    }

    dropCategory(event: any) {
        console.log('drop category', event.previousIndex, event.currentIndex);
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.updateCategoryOrder();
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.updateCategoryOrder();
        }
    }

    private updateCategoryOrder() {
        console.log('update category order');
        console.log('categories:', this.categories);
        this.categories.forEach((category) => {
            category.order = this.categories.indexOf(category);
        });
        this.categoriesService.updateCategoriesOrder(this.categories).subscribe(
            (response: any) => {
                console.log('response:', response);
            },
            (error: any) => {
                console.error('Error updating categories:', error);
            }
        );
    }

    dropChannel(event: CdkDragDrop<Channels[]>) {
        console.log('drop channel', event.previousIndex, event.currentIndex);
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    getCategories() {
        this.selectedServerId = this.utilsService.getSelectedServerId();
        this.categoriesService.getCategories(this.selectedServerId).subscribe(
            (response) => {
                console.log('categories:', response);
                this.categories = response;
                this.categories.sort((a, b) => a.order - b.order);
                this.getChannels();
            },
            (error) => {
                console.error('Error getting categories:', error);
            }
        );
    }

    getChannels() {
        this.selectedServerId = this.utilsService.getSelectedServerId();

        this.channelsService.getChannels(this.selectedServerId).subscribe(
            (response) => {
                console.log('channels:', response);
                this.channels = response;

                this.channels.forEach((channel) => {
                    const category = this.categories.find(
                        (cat) => cat.id === channel.categoryId
                    );

                    if (category) {
                        // Initialize the channels array for the category if not already initialized
                        if (!category.channels) {
                            category.channels = [];
                        }

                        // Add the channel to the category's channels array
                        category.channels.push(channel);
                    }
                });
            },
            (error) => {
                console.error('Error getting channels:', error);
            }
        );
    }

    openDialog(categoryId: string) {
        console.log('categoryId:', categoryId);
        this.channelsService.openDialog({
            categoryId,
            serverId: '1',
            visible: true,
        });
    }

    selectChannel(channelId: string) {
        this.utilsService.setSelectedChannelId(channelId);
        this.selectedChannelId = this.utilsService.getSelectedChannelId();
        this.chatService.fetchInitialMessages();
    }

    showContextMenu(event: MouseEvent, channelId: string): void {
        event.preventDefault();
        event.stopPropagation();

        this.editMenu.forEach((menu) => {
            if (menu.targetId === channelId) {
                menu.showMenu = true;
            } else {
                menu.showMenu = false;
            }
        });
    }
}
