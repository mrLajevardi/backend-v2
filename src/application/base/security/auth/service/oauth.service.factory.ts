import { Injectable } from '@nestjs/common';
import { UserOauthLoginDto } from '../dto/user-oauth-login.dto';

@Injectable()
export class OauthServiceFactory {
  static getProfileUserOauthStrategy(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): UserOauthLoginDto {
    const { name, emails, photos, provider, error } = profile;
    const user: UserOauthLoginDto = {
      provider: provider,
      error: error,
      email: emails ? emails[0].value : '',
      firstName: name ? name.givenName : '',
      lastName: name ? name.familyName : '',
      picture: (photos as []).length ? photos[0].value : [],
      accessToken,
      refreshToken,
    };

    return user;
  }
}
