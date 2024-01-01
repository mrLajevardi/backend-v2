import { ApiProperty } from '@nestjs/swagger';
import { IPSetListDto } from './ip-set-list.dto';

export class IpSetsDto {
  @ApiProperty({ type: Number })
  resultTotal: number;

  @ApiProperty({ type: Number })
  pageCount: number;

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ type: [IPSetListDto] })
  values: IPSetListDto[];
}
