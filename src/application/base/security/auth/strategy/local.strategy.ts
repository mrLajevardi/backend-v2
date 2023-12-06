import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserPayload } from '../dto/user-payload.dto';
import axios from 'axios';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly cls: ClsService,
  ) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.login.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const axiosConfig = {
      headers: {
        Authorization: 'Bearer c2a3b7f4-2d36-4c3e-93c1-910d635a378a',
        'Access-Control-Allow-Origin': '*',
      },
    };
    let aiToken: string = null;
    const aiRequest = await axios
      .post(
        'https://aradpanelback.ziaei.ir/api/Auth/SsoLogin',
        {
          phoneNumber: user.phoneNumber,
        },
        axiosConfig,
      )
      .then((res) => {
        aiToken = res.data.token;
      })
      .catch((err) => {
        console.log('Ai Service Error : ', err);
      });

    const userPayload: UserPayload = {
      userId: user.id,
      username: user.username,
      personalVerification: user.personalVerification,
      twoFactorAuth: user.twoFactorAuth,
      aiAccessToken: aiToken,
    };

    this.cls.set('userId', user.id);

    return userPayload;
  }
}
