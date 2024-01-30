import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsObject,
  Validate,
  isIP,
  IsIP,
} from 'class-validator';
import { instance } from 'ts-mockito';
import isCidr from 'is-cidr';

export class UpdateDescriptionStaticRouteVdcDto {
  @ApiProperty({
    type: String,
    example: 'test description',
  })
  description: string;
}
