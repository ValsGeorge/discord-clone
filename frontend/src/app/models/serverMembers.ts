import { User } from './user';

export interface ServerMembers {
    serverId: string;
    members: User[];
}
