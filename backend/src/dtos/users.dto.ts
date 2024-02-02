import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {

  @IsString()
    public id: string;

  @IsString()
  public nickname: string;
  
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public confirmPassword: string;
  
  @IsString()
  public profilePicture: string;
    
}


export class LoginUserDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;
}