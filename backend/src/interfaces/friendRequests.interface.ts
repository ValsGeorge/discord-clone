import { User } from './users.interface';

export interface FriendRequest {
    id: string;
    from: User;
    to: User;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
