import { BaseService } from '../../../../infrastructure/service/BaseService';
import { IDatacenterService } from '../interface/IDatacenter.service';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { Injectable } from '@nestjs/common';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';

@Injectable()
export class DatacenterService implements IDatacenterService, BaseService {
  GetDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]> {
    // Temp
    const mocks: DatacenterConfigGenResultDto[] =
      DatacenterConfigGenResultDto.GenerateDatacenterConfigGenResultDtoMock();
    return Promise.resolve(mocks);
  }

  async GetDatacenterConfigWithGenItems(
    query: DatacenterConfigGenItemsQueryDto,
  ): Promise<DatacenterConfigGenItemsResultDto[]> {
    const mocks: DatacenterConfigGenItemsResultDto[] =
      DatacenterConfigGenItemsResultDto.GenerateDatacenterConfigGenItemsResultDtoMock();

    return await Promise.resolve(mocks);
  }
}
