import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateChannelDto {
    @IsString()
    public name: string;

    @IsString()
    public description: string;

    @IsString()
    public type: string;

    @IsNumber()
    public order: number;

    @IsString()
    public server: string;

    @IsString()
    public category: string;
}
