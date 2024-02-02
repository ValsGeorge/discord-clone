import { User } from './users.interface';
import { Channel } from './channels.interface';

export interface Message {
    id: string;
    content: string;
    user: User;
    channel: Channel;
    createdAt: Date;
    updatedAt: Date;
}
