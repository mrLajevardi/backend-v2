import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceTypesDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsNumber()
  @ApiProperty()
  baseFee: number;

  @IsString()
  @ApiProperty()
  updateInstanceScript: string;

  @IsBoolean()
  @ApiProperty()
  verifyInstance: boolean;

  @IsNumber()
  @ApiProperty()
  maxAvailable: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  type?: number;

  @IsBoolean()
  @ApiProperty()
  isPayg: boolean;

  @ApiProperty()
  @IsOptional()
  paygInterval?: Date;

  @IsString()
  @ApiProperty()
  @IsOptional()
  paygScript?: string;
}
