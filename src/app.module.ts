import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './common/shared/typeorm/typeorm.service';
import { UserModule } from './api/user/user.module';
import { WalletModule } from './api/wallet/wallet.module';
import { WalletService } from './api/wallet/wallet.service';
import { UserService } from './api/user/user.service';
import { WalletController } from './api/wallet/wallet.controller';
import { UserController } from './api/user/user.controller';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string
const AWS_SECURITY_KEY = process.env.AWS_SECURITY_KEY as string

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UserModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {};