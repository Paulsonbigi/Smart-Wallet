import { Injectable, HttpException, Inject, forwardRef, Response } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
// import { Response } from 'express';
import { toFileStream } from 'qrcode';
import * as CryptoJS from 'crypto-js'
import { CreateUserDto } from './dto/user.dto';
import { User } from './user.entity';
import { Wallet } from '../wallet/wallet.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInterface, LoginUserInterface } from '../user.interface'; 
import { emailRegex, jwtConstants } from './user.constants';
import * as bcrypt from 'bcryptjs';
import { TokenPayload } from "./tokenPayload.interface"
const algorithm = 'aes-256-cbc';
import uploadPublicFile from 'src/utils/fileUpload';
// import { uploadPublicFile } from 'src/utils/fileUpload';
// import

@Injectable()
export class UserService {
    emailRegex = this.configService.get("emailRegex");
    ENCRYPTION_KEY = ((process.env.ENCRYPTION_KEY as string), 'hex');
    secret = process.env.RANDOM_IV;
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        // private filesService: FilesService
    ) {}

    propExist = async (prop) => {
        return User.findOne({ where: prop });
    };
 
    findUser = async (prop: LoginUserInterface ) => {
        const foundUser = await this.propExist({ email: prop.email });

        if(!foundUser) throw new HttpException('User already exists!', 404);

        // if (!this.emailRegex.test(prop.email)) throw new HttpException('Invalid email address', 400);
        const comparePassword = await bcrypt.compare(prop.password, foundUser.password)
        if (!comparePassword || !foundUser) {
          throw new HttpException('Incorrect credentials!', 401);
        }
        foundUser.password = undefined;
        return foundUser;

    };

    async cardTokenization(value: string) {
        try {
            const ciphertext = CryptoJS.AES.encrypt(value, this.ENCRYPTION_KEY).toString();
          return ciphertext;
        } catch (err: any) {
          throw new HttpException(err.message, 500);
        }
    };

    cardDecryption = async(ciphertext: string) => {
        try {
            const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText;
        } catch (err: any) {
            throw new HttpException(err.message, 500);
        }
    };

    register = async(user: CreateUserInterface) => {
        try{
            const { firstName, lastName, email, password } = user;

            const checkExistingUser = await this.propExist({email});
            if (checkExistingUser) throw new HttpException('User already exists!', 409);

            const newUser = User.create({
                firstName,
                lastName,
                email,
                password,
            });

            const savedUser = await newUser.save();
            const walletInstance = new Wallet();
            walletInstance.user = newUser;
            await walletInstance.save();

            return { message: 'User created successfully', newUser, walletInstance};
        } catch(error: any){
            throw new HttpException(error.message, 500);
        }
    };

    login =async (user: LoginUserInterface) => {
        try{
            const foundUser = await this.findUser(user);
            if(foundUser.blackListed) {
                return {
                    message: 'Your account has been suspended, please contact our support team.',
                };
            }
            const payload = { email: foundUser.email, id: foundUser.id };
            return {
                access_token: this.jwtService.sign(payload),
                user: foundUser,
                message: 'Login Successful',
            };
        } catch(error: any){
            throw new HttpException(error.message, 500);
        }
    };

    getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    };
     
    getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
          cookie,
          token
        }
    };

    getCookieWithJwtToken =(userId: any) => {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    };

    getCookiesForLogOut= async () =>{
        return [
          'Authentication=; HttpOnly; Path=/; Max-Age=0',
          'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    };

    removeRefreshToken= async(userId: any) =>{
        return User.update(userId, {
          currentHashedRefreshToken: null
        });
    };

    myAccount = async (id: any) => {
        try{
            const user = await User.findOne({where: {id}})
            if(!user) throw new HttpException('User already exists!', 409);
            user.password = undefined;
            return user;

        } catch(error: any) {
            throw new HttpException(error.message, 500);
        }
    };

    updateUser = async (id: any, users: User) => {
        try{
            const user = await User.findOne({where: {id}})
            if(!user) throw new HttpException('User does not exist!', 409);
            if (users.card) {
                users.card = await this.cardTokenization(users.card);
            }
            if (users.cardCvv) {
                users.cardCvv = await this.cardTokenization(users.cardCvv);
            }
            const updatedUser = await User.save({
                id: user.id,
                ...users,
              });
              updatedUser.password = undefined;
            return { message: 'user updated successfully', updatedUser };

        } catch(error: any) {
            throw new HttpException(error.message, 500);
        }
    };

    updateUserImage = async (userId: number, imageBuffer: Buffer, filename: string) => {
        try{
            const avatar = await uploadPublicFile(imageBuffer, filename);
            const user = await this.propExist({id:userId});
            user.avatarImage = avatar.Location
            await user.save();
            return user
        } catch(error: any) {
            throw new HttpException(error.message, 500);
        }
    };

    generateTwoFactorAuthenticatorSecret = async (userId: any) => {
        try{
            const user = await User.findOne({where: {id: userId}});
            const secret = authenticator.generateSecret();
            const otpauthUrl = authenticator.keyuri(user.email, process.env.BASE_URL, secret);
            await User.update(userId, {
                twoFactorAuthenticationSecret: otpauthUrl
            });
            return {
                message: "Success",
                secret,
                otpauthUrl
            };
        } catch(error: any) {
            throw new HttpException(error.message, 500);
        }
    };

    pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        try{
            return toFileStream(stream, otpauthUrl);
        } catch(error: any){
            throw new HttpException(error.message, 500);
        }
    };

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        return authenticator.verify({
          token: twoFactorAuthenticationCode,
          secret: user.twoFactorAuthenticationSecret
        })
    }

    turnOnTactorAuthentication = async (userId: any) => {
        try{
            await User.update(userId, {
                isTwoFactorAuthenticationEnabled: true
            });
            return { message: "2FA successfully activated."}
        } catch(error: any){
            throw new HttpException(error.message, 500);
        }
    };
};