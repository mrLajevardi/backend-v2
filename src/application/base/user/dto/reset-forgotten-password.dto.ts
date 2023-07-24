import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetForgottenPasswordDto {
  @IsString()
  @MinLength(8)
  @ApiProperty()
  newPassword: string;
}
