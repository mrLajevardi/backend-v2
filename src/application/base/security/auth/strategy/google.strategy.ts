import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UserOauthLoginGoogleDto } from '../dto/user-oauth-login-google.dto';
import { OauthServiceFactory } from '../service/oauth.service.factory';
import { UserOauthLoginGithubDto } from '../dto/user-oauth-login-github.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const userOauth: UserOauthLoginGoogleDto =
      OauthServiceFactory.getProfileUserOauthStrategy(
        accessToken,
        refreshToken,
        profile,
      );
    done(null, userOauth);
  }
}
