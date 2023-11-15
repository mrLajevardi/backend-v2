import {Injectable} from "@nestjs/common";
import {TwoFaAuthInterface} from "./interface/two-fa-auth.interface";
import {UserPayload} from "../dto/user-payload.dto";


@Injectable()
export class TwoFaAuthStrategy {

    private strategy: TwoFaAuthInterface;

    public setStrategy(strategy: TwoFaAuthInterface) {
        this.strategy = strategy;
    }

    public async sendOtp(user: UserPayload) {
        return await this.strategy.sendOtp(user)
    }
}