import { IsString } from 'class-validator';

export class CreateDmListDto {
    @IsString()
    public me: string;

    @IsString()
    public user: string;
}
