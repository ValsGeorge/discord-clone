import { User } from '@interfaces/users.interface';

export interface Server {
    id: string;
    name: string;
    description: string;
    type: string;
    owner: User;
    members: User[];
    createdAt: Date;
    updatedAt: Date;
}