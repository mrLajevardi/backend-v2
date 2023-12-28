import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNotIn,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { Transform } from 'class-transformer';

export class EnableTwoFactorAuthenticateDto {
  @ApiProperty({
    description: 'type of two factor authenticate',
  })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  @IsEnum(TwoFaAuthTypeEnum)
  @IsNotIn([0])
  twoFactorAuthType: number;
}
