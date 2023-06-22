import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicePropertiesDto {
  @IsString()
  @ApiProperty()
  serviceInstanceId?: string;

  @IsString()
  @ApiProperty()
  propertyKey?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  value?: string;
}
