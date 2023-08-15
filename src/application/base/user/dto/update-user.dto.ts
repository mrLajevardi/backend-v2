import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Groups } from 'src/infrastructure/database/entities/Groups';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  password?: string;

  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  family?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  vdcPassword?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  hasVdc?: boolean | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phoneNumber?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  orgName?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  acceptTermsOfService?: boolean | null;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [Groups] })
  groups?: Groups[];
}
