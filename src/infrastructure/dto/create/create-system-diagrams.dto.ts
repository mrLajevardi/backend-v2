import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSysdiagramsDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  principalId: number;

  @IsNumber()
  @ApiProperty()
  diagramId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  version: number | null;

  @IsOptional()
  @ApiProperty({ required: false })
  definition: Buffer | null;
}
