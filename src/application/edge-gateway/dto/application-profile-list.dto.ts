import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsString,
  Max,
  IsOptional,
} from 'class-validator';
import { ApplicationPortProfileListValuesDto } from './application-port-profile-list-values.dto';
import { Transform } from 'class-transformer';

export class ApplicationProfileListDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  total: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  pageCount: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  page: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  pageSize: number;

  @ApiProperty({ type: [ApplicationPortProfileListValuesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  values: ApplicationPortProfileListValuesDto[];
}

export class ApplicationProfileListQueryDto {
  @ApiProperty({ type: Number })
  @Transform((item) => Number(item.value))
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number })
  @Transform((item) => Number(item.value))
  @IsNumber()
  @Min(1)
  @Max(500)
  pageSize: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  filter?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
