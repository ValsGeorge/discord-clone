import { User } from '@interfaces/users.interface';
import { Category } from './categories.interface';

export interface Server {
    id: string;
    name: string;
    description: string;
    categories: Category[];
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}
