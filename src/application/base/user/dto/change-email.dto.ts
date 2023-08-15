import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
