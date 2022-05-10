import { Injectable } from '@nestjs/common';
import Flutterwave from 'flutterwave-node-v3';
import { UserService } from '../user/user.service';
import { HttpException } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { User } from '../user/user.entity';
import { CRYPTO_URL } from './wallet.contants';
import axios from 'axios';
// import { flutterwave } from 'src/utils/flutterwave';
const Flutterwave = require('flutterwave-node-v3');
const FLW_PUBLIC_KEY: string = "FLWPUBK_TEST-e366eea06d88c611835dc7abcd8ff1e8-X";
const FLW_SECRET_KEY: string = "FLWSECK_TEST-7a7a0286f5a486aa6fb7deea4e846a9e-X";
export const flutterwave = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);

@Injectable()
export class WalletService {
  constructor(
    private userService: UserService,
    ) {}

   flutterwaveCharge= async(payload: any) =>{

    try {
      const response = await flutterwave.Charge.card(payload);
      if (response.meta.authorization.mode === 'pin') {
        const payload2 = payload;
        payload2.authorization = {
          mode: 'pin',
          fields: ['pin'],
          pin: payload.pin,
        };
        const reCallCharge = await flutterwave.Charge.card(payload2);

        const callValidate = await flutterwave.Charge.validate({
          otp: payload.otp,
          flw_ref: reCallCharge.data.flw_ref,
        });
      }
      if (response.meta.authorization.mode === 'redirect') {
        const url = response.meta.authorization.redirect;
        open(url);
      }

      console.log(response);

      return response.data;
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  }

  async flutterwaveWithdraw(payload: object) {
    try {
      const response = await flutterwave.Charge.ng(payload);
      return response.data;
    } catch (error: any) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  }

  async getBankCode(bank: string): Promise<string> {
    try{
      let bank_code = '';
      switch (bank) {
        case (bank = 'Access Bank'):
          bank_code = '044';
          break;
  
        case (bank = 'Ecobank'):
          bank_code = '050';
          break;
  
        case (bank = 'Fidelity Bank'):
          bank_code = '070';
          break;
  
        case (bank = 'First Bank of Nigeria'):
          bank_code = '011';
          break;
  
        case (bank = 'First City Monument Bank (FCMB)'):
          bank_code = '214';
          break;
  
        case (bank = 'GTBank'):
          bank_code = '058';
          break;
  
        case (bank = 'Heritage Bank'):
          bank_code = '030';
          break;
  
        case (bank = 'Keystone Bank'):
          bank_code = '082';
          break;
  
        case (bank = 'Stanbic IBTC Bank'):
          bank_code = '221';
          break;
  
        case (bank = 'Sterling Bank'):
          bank_code = '232';
          break;
  
        case (bank = 'Union Bank'):
          bank_code = '032';
          break;
  
        case (bank = 'United Bank for Africa'):
          bank_code = '033';
          break;
  
        case (bank = 'Unity Bank'):
          bank_code = '215';
          break;
  
        case (bank = 'Wema Bank'):
          bank_code = '035';
          break;
  
        case (bank = 'Zenith Bank'):
          bank_code = '057';
          break;
  
        default:
          bank_code = '';
          break;
      }

      return bank_code;
    } catch(error: any) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  }

  async checkIfWalletExists(obj: object): Promise<any | User> {
    try {
      return await Wallet.findOne(obj);
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  };

  async flutterWaveRate(): Promise<any | User> {
    try {
      const payload = {
        service: "rates_convert",
        service_method: "post",
        service_version: "v1",
        service_channel: "transactions",
        service_channel_group: "merchants",
        service_payload: {
          FromCurrency: "USD",
          ToCurrency: "NGN",
          Amount: 5000
        }
      };
      console.log(flutterwave.MobileMoney.ghana);
    const response = await flutterwave.Misc.exchange_rates(payload);
    return response
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  }

  async getCoinData(): Promise<object> {
    try {
      const response = await axios.get(CRYPTO_URL);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  }

  async getAllWallets(): Promise<Wallet[]> {
    try {
      const wallets = await Wallet.find();
      return wallets;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, 500);
    }
  }
}
