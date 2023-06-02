import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsNumber()
  @ApiProperty()
  additionRatio: number;

  @IsNumber()
  @ApiProperty()
  additionAmount: number;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  condition: string;

  @IsBoolean()
  @ApiProperty()
  enabled: boolean;

  @IsString()
  @ApiProperty()
  applyTo: string;
}
