import { ApiProperty } from '@nestjs/swagger';
import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetProviderVdcsDto extends EndpointOptionsInterface {
  params: GetProviderVdcsParams;
}

export class GetProviderVdcsParams {
  filter?: string;

  sortAsc?: string;

  sortDesc?: string;

  @ApiProperty({
    type: Number,
  })
  page: number;

  @ApiProperty({
    type: Number,
  })
  pageSize: number;
}
