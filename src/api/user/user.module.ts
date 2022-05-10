import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from './user.entity';
import { LocalStrategy } from "./user.local-strategy"
import { JwtStrategy } from "./user-jwt.strategy"
import { UserAuthGuard } from './user.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { emailRegex, jwtConstants } from './user.constants';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WalletService } from '../wallet/wallet.service';
// import { FilesService } from 'src/utils/fileUpload';

const config = ConfigService
const secret = process.env.SECRET_KEY; 
@Module({
    imports: [PassportModule,
        TypeOrmModule.forFeature([User]), 
        JwtModule.register({
            secret: "what-a-good-time-to-be-alive",
            // secret: secret,
            signOptions: {expiresIn: '1h'},
    }),
  ],
    controllers: [UserController],
    // providers: [UserService, WalletService, LocalStrategy, JwtStrategy, UserAuthGuard],
    providers: [UserService, WalletService, LocalStrategy, JwtStrategy],
    exports: [UserService]
})
export class UserModule {};