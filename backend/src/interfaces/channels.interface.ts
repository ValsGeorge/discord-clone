import { Server } from '@interfaces/servers.interface';
import { Category } from './categories.interface';

export interface Channel {
    id: string;
    name: string;
    description: string;
    type: string;
    order: number;
    server: Server;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
