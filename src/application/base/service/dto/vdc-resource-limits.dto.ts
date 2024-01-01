import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VdcResourceLimitsDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  ip: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  cpuCores: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  vm: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ram: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  storage: number;
}
