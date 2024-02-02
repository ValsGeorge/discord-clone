import { IsString } from 'class-validator';
import { User } from '@/interfaces/users.interface';

export class CreateFriendRequestDto {
    @IsString()
    public from: User;

    @IsString()
    public to: User;

    @IsString()
    public status: string;
}
