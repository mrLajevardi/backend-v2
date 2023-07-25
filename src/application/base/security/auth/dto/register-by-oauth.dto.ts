import { ApiProperty } from '@nestjs/swagger';

export class RegisterByOauthDto {
  id?: number;

  @ApiProperty()
  emailToken: string;

  @ApiProperty()
  pjwt: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  vdcPassword: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  family: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  phoneVerified: boolean;

  @ApiProperty()
  acceptTermsOfService: boolean;
}
