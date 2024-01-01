import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class ResendEmailDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
