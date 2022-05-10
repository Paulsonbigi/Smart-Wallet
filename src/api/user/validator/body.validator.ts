import { Injectable, HttpException, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { CreateUserDto, UserQueryDto, LoginUserDto } from 'src/api/user/dto/user.dto';
import { registerUserSchema, loginUserSchema } from './user.validator';

export class CreatUserValidatorPipe
  implements PipeTransform<UserQueryDto, CreateUserDto>
    {
    public transform(
        query: UserQueryDto,
        metadata: ArgumentMetadata,
    ): CreateUserDto {
        const result = registerUserSchema.validate(query, {
        convert: true,
        });

        if (result.error) {
        const errorMessages = result.error.details.map((d) => d.message).join();
        throw new HttpException(errorMessages, 400);
        }

        const validSpaceShip = result.value;
        return {
        firstName: validSpaceShip.firstName,
        lastName: validSpaceShip.lastName,
        email: validSpaceShip.email,
        password: validSpaceShip.password,
        } as CreateUserDto;
    }
}

export class LoginUserValidatorPipe
  implements PipeTransform<UserQueryDto, LoginUserDto>
    {
    public transform(
        query: UserQueryDto,
        metadata: ArgumentMetadata,
    ): LoginUserDto {
        const result = loginUserSchema.validate(query, {
        convert: true,
        });

        if (result.error) {
        const errorMessages = result.error.details.map((d) => d.message).join();
        throw new HttpException(errorMessages, 400);
        }

        const validSpaceShip = result.value;
        return {
            email: validSpaceShip.email,
            password: validSpaceShip.password
        } as LoginUserDto;
    }
}