import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  public validate = async (email: string, password: string): Promise<User>  => {
    const user = await this.userService.findUser({email, password});
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  };
}
