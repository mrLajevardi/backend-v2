import { BaseService } from '../../../../infrastructure/service/BaseService';
import { IDatacenterService } from '../interface/IDatacenter.service';
import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatacenterService implements IDatacenterService, BaseService {
  GetDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]> {
    // Temp
    const mocks =
      DatacenterConfigGenResultDto.GenerateDatacenterConfigGenResultDtoMock();
    return Promise.resolve(mocks);
  }
}
