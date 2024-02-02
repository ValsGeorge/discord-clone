import { IsString } from 'class-validator';
import { User } from '@/interfaces/users.interface';

export class CreateFriendDto {
    @IsString()
    public user: User;

    @IsString()
    public friend: User;
}
