import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateApplicationPortDto } from './create-application-port.dto';

export class CreateApplicationPortProfileDto {
  @ApiProperty({ example: 'AD Server' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [CreateApplicationPortDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateApplicationPortDto)
  applicationPorts: CreateApplicationPortDto[];
}
