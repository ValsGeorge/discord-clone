import { Server } from '@interfaces/servers.interface';

export interface Channel {
    id: string;
    name: string;
    description: string;
    type: string;
    server: Server;
    createdAt: Date;
    updatedAt: Date;
}