import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetDatacenterConfigsQueryDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  datacenterName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  serviceTypeId: string;
}
