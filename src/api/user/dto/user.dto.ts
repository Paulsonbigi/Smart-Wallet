import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

}

export class LoginUserDto {
  
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
  
  }

export class UserQueryDto {

    @IsNotEmpty()
    @IsString()
    id?: string;
  
    @IsNotEmpty()
    @IsString()
    lastName?: string;
    
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email?: string;
  
  }


//   @ApiProperty({
//     description: "The user's email",
//     required: true,
//   }) will implement swagger UI later