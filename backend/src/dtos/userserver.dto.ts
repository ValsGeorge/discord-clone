import { Server } from '@/interfaces/servers.interface';
import { User } from '@/interfaces/users.interface';
import { IsString } from 'class-validator';

export class CreateUserServerDto {
    @IsString()
    public user: User;

    @IsString()
    public server: Server;

    @IsString()
    public role: string;
}
