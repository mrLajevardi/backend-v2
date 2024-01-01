import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNumber, IsString, Matches } from 'class-validator';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';

export class DisableTwoFactorAuthenticateDto {
  @IsNumber()
  @ApiProperty({
    description: 'type of two factor authenticate',
    example: 1,
  })
  @IsEnum(TwoFaAuthTypeEnum)
  twoFactorAuthType: number;
}
