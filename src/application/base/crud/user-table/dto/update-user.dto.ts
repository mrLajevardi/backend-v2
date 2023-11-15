import {
  IsArray,
  IsBoolean,
  IsDate, IsDecimal,
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
  realm?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  password?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  emailVerified?: boolean | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  active?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  family?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  verificationToken?: boolean | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  deleted?: boolean | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  updateDate?: Date | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  code?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  emailToken?: string | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  credit?: number | null;

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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  phoneVerified?: boolean;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [Groups], required: false })
  groups?: Groups[];


  @IsString()
  @IsOptional()
  @ApiProperty({required: false})
  personalCode?: string | null;


  @IsDate()
  @IsOptional()
  @ApiProperty({required: false})
  birthDate?: Date;


  @IsDecimal()
  @IsOptional()
  @ApiProperty({required: false})
  companyId?: number

  @IsBoolean()
  @IsOptional()
  @ApiProperty({default: false , required: false})
  companyOwner?: boolean | null


  @IsBoolean()
  @IsOptional()
  @ApiProperty({required: false})
  personalVerification?: boolean;

}
