import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangePasswordAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;
}
