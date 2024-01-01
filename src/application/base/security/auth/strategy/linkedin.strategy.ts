import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';
import { UserOauthLoginGoogleDto } from '../dto/user-oauth-login-google.dto';
import { UserOauthLoginLinkedinDto } from '../dto/user-oauth-login-linkedin.dto';
import { OauthServiceFactory } from '../service/oauth.service.factory';

// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-strategy';
// import { Injectable } from '@nestjs/common';
// import { VerifyCallback } from 'passport-custom';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedIn') {
  constructor() {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT_URI,
      // scope: ['email', 'profile', 'openid'],
      scope: ['r_liteprofile', 'r_emailaddress'],
      // r_liteprofile r_emailaddress
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const userOauth: UserOauthLoginLinkedinDto =
      OauthServiceFactory.getProfileUserOauthStrategy(
        accessToken,
        refreshToken,
        profile,
      );
    done(null, userOauth);
  }
}
