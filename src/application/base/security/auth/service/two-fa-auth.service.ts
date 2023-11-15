import {Injectable} from '@nestjs/common';
import {UserPayload} from "../dto/user-payload.dto";
import {TwoFaAuthTypeService} from "../classes/two-fa-auth-type.service";
import {TwoFaAuthTypeEnum} from "../enum/two-fa-auth-type.enum";
import {TwoFaAuthStrategy} from "../classes/two-fa-auth.strategy";

@Injectable()
export class TwoFaAuthService {
    constructor(
        private readonly TwoFaAuthType: TwoFaAuthTypeService,
        private TwoFaAuthStrategy: TwoFaAuthStrategy
    ) {
    }

    private dictionary = {
        1: this.TwoFaAuthType.sms,
        2: this.TwoFaAuthType.email,
    }

    public async sendOtp(user: UserPayload) {

        this.TwoFaAuthStrategy.setStrategy(this.dictionary[user.twoFactorAuth]);

        return await this.TwoFaAuthStrategy.sendOtp(user);
    }
}
