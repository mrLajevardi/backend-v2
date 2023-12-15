import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDatacenterConfigsQueryDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  datacenterName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  serviceTypeId: string;
}
