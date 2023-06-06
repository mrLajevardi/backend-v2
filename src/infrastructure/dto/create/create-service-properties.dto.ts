import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServicePropertiesDto {
  @IsString()
  @ApiProperty()
  serviceInstanceId: string;

  @IsString()
  @ApiProperty()
  propertyKey: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  value?: string;
}
