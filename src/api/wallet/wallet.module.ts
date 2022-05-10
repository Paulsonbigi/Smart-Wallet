import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { walletProviders } from './wallet.provider';
import { JwtStrategy } from '../user/user-jwt.strategy';

@Module({
    imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Wallet])],
    providers: [WalletService, ...walletProviders],
    controllers: [WalletController]
})
export class WalletModule {}