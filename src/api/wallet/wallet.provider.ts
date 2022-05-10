import { Wallet } from "./wallet.entity";
import { WALLET_REPO, USER_REPO } from "src/utils/global.constant";
import { User } from "../user/user.entity";

export const walletProviders = [
    {
      provide: WALLET_REPO,
      useValue: Wallet,
    },
    {
        provide: USER_REPO,
        useValue: User,
    }
];