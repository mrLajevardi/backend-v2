import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../service/auth.service';
import {UserPayload} from '../dto/user-payload.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    // The validation that will be checked before
    // any endpoint protected with jwt-auth guard
    async validate(username: string, password: string): Promise<any> {

        const user = await this.authService.login.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        const userPayload: UserPayload = {
            userId: user.id,
            username: user.username,
            personalVerification: user.personalVerification,
            twoFactorAuth: user.twoFactorAuth
        };
        return userPayload;
    }
}
