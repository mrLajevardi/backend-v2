import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  propertyKey: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  value: string;
}
