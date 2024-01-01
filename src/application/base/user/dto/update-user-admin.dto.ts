import { IsDate, IsEmail, IsISO8601, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserAdminDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  family: string;

  @IsString()
  @IsISO8601()
  @ApiProperty()
  birthDate?: Date;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
}
