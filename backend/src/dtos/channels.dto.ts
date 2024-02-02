import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateChannelDto {
    @IsString()
    public name: string;

    @IsString()
    @IsOptional()
    public description: string;

    @IsString()
    public type: string;

    @IsNumber()
    public order: number;

    @IsString()
    public category: string;

    @IsString()
    public server: string;
}
