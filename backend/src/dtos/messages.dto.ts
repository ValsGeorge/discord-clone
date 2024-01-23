import { IsString, IsOptional } from 'class-validator';
import { User } from '../interfaces/users.interface';
import { Channel } from '../interfaces/channels.interface';

export class CreateMessageDto {
    @IsString()
    public content: string;

    @IsString()
    public user?: User;

    @IsString()
    public channel?: Channel;
}
