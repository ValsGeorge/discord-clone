import { Channel } from './channels.interface';
import { Server } from './servers.interface';
export interface Category {
    id: string;
    name: string;
    server: Server;
    channels: Channel[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
