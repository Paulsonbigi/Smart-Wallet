const Flutterwave = require('flutterwave-node-v3');
import { ConfigService } from '@nestjs/config';

const FLW_PUBLIC_KEY: string = process.env.FLW_PUBLIC_KEY;
const FLW_SECRET_KEY: string = process.env.FLW_SECRET_KEY;

export const flutterwave = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);