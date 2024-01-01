export class OauthResponseDto {
  error: Error;
  verified: boolean;
  email: string;
  firstname?: string = 'کاربر';
  lastname?: string = 'گرامی';
}
