import { User } from '@interfaces/users.interface';
import { Server } from '@interfaces/servers.interface';

export interface UserServer {
    id: string;
    user: User;
    server: Server;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
