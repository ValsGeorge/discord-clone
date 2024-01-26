import { User } from './user';

export interface DmList {
    id: string;
    me: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}
