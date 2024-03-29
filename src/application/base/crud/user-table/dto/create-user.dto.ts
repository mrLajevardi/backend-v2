import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  realm: string | null;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  emailVerified: boolean | null;

  @IsBoolean()
  @ApiProperty()
  active: boolean;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  family: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  verificationToken?: boolean | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  deleted: boolean | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  createDate?: Date | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  updateDate?: Date | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  code: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  emailToken: string | null;

  // @IsNumber()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // credit?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  vdcPassword: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  hasVdc: boolean | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phoneNumber: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  orgName?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  acceptTermsOfService: boolean | null;

  @IsBoolean()
  @ApiProperty()
  phoneVerified: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  personalCode?: string | null;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ required: false, type: Date })
  birthDate?: Date;

  @IsDecimal()
  @IsOptional()
  @ApiProperty({ required: false })
  companyId?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ default: false, required: false })
  companyOwner?: boolean;
}
