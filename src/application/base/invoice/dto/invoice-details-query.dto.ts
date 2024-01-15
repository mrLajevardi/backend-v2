import { faker } from '@faker-js/faker';
import { ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { BaseResultDto } from 'src/infrastructure/dto/base.result.dto';
import { BaseQueryDto } from '../../../../infrastructure/dto/base.query.dto';
import { IsBoolean, IsBooleanString, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class InvoiceDetailsQueryDto extends BaseQueryDto {
  @ApiProperty({
    name: 'preFactor',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsString()
  preFactor = 'false';
}
