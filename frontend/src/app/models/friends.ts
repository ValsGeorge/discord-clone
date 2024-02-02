import { User } from './user';

export interface Friend {
    id: string;
    user: User;
    friend: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface FriendRequest {
    id: string;
    from: User;
    to: User;
    createdAt: Date;
    updatedAt: Date;
}
