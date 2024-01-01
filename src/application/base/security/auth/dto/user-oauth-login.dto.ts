export class UserOauthLoginDto {
  provider?: string;
  email?: string;
  error?: any;
  firstName?: string;
  lastName?: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
}
