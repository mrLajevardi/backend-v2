import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  password: string;
}
