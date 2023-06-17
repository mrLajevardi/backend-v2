import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessTokenDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  id?: string;

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
  created?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  realm?: string;
}
