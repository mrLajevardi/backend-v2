import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccessTokenDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  ttl?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  scopes?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  updated?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  realm?: string;
}
