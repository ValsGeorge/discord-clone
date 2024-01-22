import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateChannelDto {
    @IsString()
    public name: string;

    @IsString()
    public type: string;

    @IsNumber()
    public order: number;

    @IsDate()
    public createdAt: Date;

    @IsDate()
    public updatedAt: Date;
}