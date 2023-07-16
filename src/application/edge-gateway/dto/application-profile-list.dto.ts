import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ApplicationPortProfileListValuesDto } from './application-port-profile-list-values.dto';

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
