import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches } from 'class-validator';

export class EnableTwoFactorAuthenticateDto {
  @IsString()
  @ApiProperty({
    description: 'type of two factor authenticate',
    example: 'email or sms',
  })
  @IsIn(['email', 'sms'])
  twoFactorAuthType: string;
}
