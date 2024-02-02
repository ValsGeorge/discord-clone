import { User } from './users.interface';

export interface Dm {
    id: string;
    content: string;
    sender: User;
    receiver: User;
    createdAt: Date;
    updatedAt: Date;
}
