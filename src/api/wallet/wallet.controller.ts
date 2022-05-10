import { Controller, Get, HttpException, Post, Injectable, Inject, forwardRef } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDecorator } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserAuthGuard } from '../user/user.guard';
import { userLocalGuard } from '../user/user-local.guard';
import { Roles } from '../user/user.roles.decorator';
import { Role } from '../user/user.role.enum';

@Controller("api/wallet")
export class WalletController {
    constructor(
        @Inject(forwardRef(() => UserService))
        private configService: ConfigService,
        private walletService: WalletService,
        private userService: UserService,
    ) {};

    @UseGuards(UserAuthGuard)
    @Post('fund_wallet')
    @Roles(Role.User)
    async fundWallet(@Request() req) {
        const { amount } = req.body
        // get the user card details from the req.user object
        if (!req.user.card || !req.user.cardCvv || !req.user.cardExpiration)
        throw new HttpException(
            'your financial details are not complete, please update your profile!',
            400,
        );

        const card = await this.userService.cardDecryption(req.user.card);
        const cardCvv = await this.userService.cardDecryption(req.user.cardCvv);
        const wallet = await this.walletService.checkIfWalletExists({
            where: { user: req.user.id },
        });
        if (!wallet) throw new HttpException('wallet not found', 404);
        wallet.balance = wallet.balance + Number(amount);

        // get the expiry year and month from the req.user object
        const [month, year] = req.user.cardExpiration.split('/');
        const payloadObj = {
            card_number: card,
            cvv: cardCvv,
            expiry_month: month,
            expiry_year: year,
            currency: 'NGN',
            amount: amount,
            fullname: `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.email,
            enckey: this.configService.get<string>('FLW_ENCRYPTION_KEY'),
            tx_ref: `ref-card-${Date.now()}`, // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
            authorization: {},
            pin: req.body.pin,
            otp: req.body.otp,
        };
        await wallet.save();
        return await this.walletService.flutterwaveCharge(payloadObj);
    };

    @Get('all')
    @UseGuards(UserAuthGuard)
    @Roles(Role.User)
    async allWallets(@Request() req) {
        return await this.walletService.getAllWallets();
    };

    @Get('my_wallet')
    @Roles(Role.User)
    @UseGuards(UserAuthGuard)
    async getWallet(@Request() req, @UserDecorator() user: any) {
        const wallet = await Wallet.findOne({
            where: { user: { id: user.id } },
        });
        if (!wallet) throw new HttpException('Wallet not found', 404);
        return {message: "Wallets successfully retrieved.", data: wallet};
    };

    @Post('bank_code')
    @Roles(Role.User)
    @UseGuards(UserAuthGuard)
    async getBankCodeReq(@Request() req) {
        const { bank } = req.body;
        const data = await this.walletService.getBankCode(bank)
        if (data === '') throw new HttpException('Bank code not available for bank you selected.', 404);
        return {message: "Bank code successfully retrieved", data};
    }


    @Get('exchange_rate')
    @Roles(Role.User)
    @UseGuards(UserAuthGuard)
    async getFlutterRates(@Request() req) {
        const data = await this.walletService.flutterWaveRate()
        return {message: "Bank code successfully retrieved", data};
    }flutterWaveRate
    
}
