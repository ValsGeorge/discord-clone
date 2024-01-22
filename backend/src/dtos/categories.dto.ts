import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateCategoryDto {

  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNumber()
  public order: number;
    
  @IsDate()
  public createdAt: Date;

  @IsDate()
  public updatedAt: Date;

}
