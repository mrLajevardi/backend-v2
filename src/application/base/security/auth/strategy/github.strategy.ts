import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github';
import { Injectable } from '@nestjs/common';
import { OauthServiceFactory } from '../service/oauth.service.factory';
import { UserOauthLoginGithubDto } from '../dto/user-oauth-login-github.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/login/oauth',
      scope: ['public_profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const userOauth: UserOauthLoginGithubDto =
      OauthServiceFactory.getProfileUserOauthStrategy(
        accessToken,
        refreshToken,
        profile,
      );
    done(null, userOauth);
  }
}
