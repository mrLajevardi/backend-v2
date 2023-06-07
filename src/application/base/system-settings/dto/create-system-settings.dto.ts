import { IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemSettingsDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  propertyKey: string;

  @IsString()
  @ApiProperty()
  value: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  createDate: Date | null;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  updateDate: Date | null;
}
