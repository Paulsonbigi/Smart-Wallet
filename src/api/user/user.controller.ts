import { Body, Controller, Get, Inject, Param, UseInterceptors, UploadedFile, ParseIntPipe, Response, Res, Post, Req, Put } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Response } from 'express';
// import { Response } from 'express';
import RequestWithUser from './user.request';
import { CreateUserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreatUserValidatorPipe, LoginUserValidatorPipe } from './validator/body.validator';
import { UserAuthGuard } from './user.guard';
import { UserDecorator } from './user.decorator';
import { userLocalGuard } from './user-local.guard';
import { Roles } from './user.roles.decorator';
import { Role } from './user.role.enum';
import { CreateUserInterface } from '../user.interface';
import RolesGuard from './user.role.guard';

@Controller('api')
export class UserController {
    @Inject(UserService)
    private readonly service: UserService;

    @Post('auth/register')
    async register(@Body(new CreatUserValidatorPipe()) user) {
      return await this.service.register(user);
    };

    @Post('auth/login')
    @UseGuards(userLocalGuard)
    async login(@Body(new LoginUserValidatorPipe()) user ){
      return await this.service.login(user);
    };

    @Post('auth/logout')
    @UseGuards(UserAuthGuard)
    async logOut(@Req() request: any) {
      console.log("request....", request.user)
      await this.service.removeRefreshToken(request.user.userId);
      const check: any = request.res.setHeader('Set-Cookie', this.service.getCookiesForLogOut());
    }

    @Get('user/my-accounts')
    // @UseGuards(RolesGuard(Role.Admin))
    @UseGuards(UserAuthGuard)
    public getUser(@Req() request: RequestWithUser): Promise<User> {
      const { userId }: any = request.user
      return this.service.myAccount(userId);
    };

    @Put('user/update-card/:id')
    @UseGuards(UserAuthGuard)
    public updateCard(@Req() request: RequestWithUser, @Body() user, @Param() param, @UserDecorator() users: any) {
      const { userId }: any = request.user;
      return this.service.updateUser(userId, user);
    };

  @Post('user/profile-picture')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    const { userId }: any = request.user;
    return this.service.updateUserImage(userId, file.buffer, file.originalname);
  };

  @Post('user/2fa-secret')
  @UseGuards(UserAuthGuard)
  async generate2FASecret(@Res() response: Response, @Req() request: RequestWithUser) {
    const { userId }: any = request.user;
    const { otpauthUrl }: any = await this.service.generateTwoFactorAuthenticatorSecret(userId);
    return this.service.pipeQrCodeStream(response, otpauthUrl)
  };

  @Post('user/2fa-switch')
  @UseGuards(UserAuthGuard)
  async turnOnTwoFactorAuthentication(@Res() response: Response, @Req() request: RequestWithUser) {
    const { userId }: any = request.user;
    const update2FA = await this.service.turnOnTactorAuthentication(userId);
    console.log("update2FA", update2FA)
    return {message: "2FA successfully activated."};
  };
}