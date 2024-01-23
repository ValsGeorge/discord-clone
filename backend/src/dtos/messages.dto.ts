import { IsString, IsOptional } from 'class-validator';
import { User } from '../interfaces/users.interface';
import { Channel } from '../interfaces/channels.interface';

export class CreateMessageDto {
    @IsString()
    public content: string;

    @IsString()
    public user?: string;

    @IsString()
    public channel?: string;
}
