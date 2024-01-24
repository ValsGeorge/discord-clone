import { IsString } from 'class-validator';

export class CreateDmDto {
    @IsString()
    public content: string;

    @IsString()
    public sender: string;

    @IsString()
    public receiver: string;
}
