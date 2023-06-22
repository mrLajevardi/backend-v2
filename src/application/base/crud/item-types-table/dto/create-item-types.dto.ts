import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemTypesDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  id?: number;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  unit: string;

  @IsNumber()
  @ApiProperty()
  fee: number;

  @IsInt()
  @ApiProperty()
  maxAvailable: number;

  @IsString()
  @ApiProperty()
  code: string;

  @IsInt()
  @ApiProperty({ required: false })
  maxPerRequest: number | null;

  @IsInt()
  @ApiProperty({ required: false })
  minPerRequest: number | null;
}
