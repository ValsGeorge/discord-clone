import { IsArray, IsOptional, IsString } from 'class-validator';
import { User } from '../interfaces/users.interface';

export class CreateServerDto {
    @IsString()
    public name: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsString()
    @IsOptional()
    public inviteCode?: string;

    @IsString()
    @IsOptional()
    public image?: string;

    @IsString()
    @IsOptional()
    public owner?: User;

    @IsArray()
    @IsOptional()
    public members?: User[];
}
