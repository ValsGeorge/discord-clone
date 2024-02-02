import { User } from './users.interface';

export interface Friend {
    id: string;
    user: User;
    friend: User;
    createdAt: Date;
    updatedAt: Date;
}
