import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class IPSetListDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  ipList: string[];
}

export class GetIpSetsListQueryDto {
  @ApiProperty({ type: Number })
  @Transform((item) => Number(item.value))
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number })
  @Transform((item) => Number(item.value))
  @IsNumber()
  @Min(1)
  @Max(128)
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
