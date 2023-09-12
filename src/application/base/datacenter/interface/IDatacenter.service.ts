import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { IBaseService } from '../../../../infrastructure/service/IBaseService';

export interface IDatacenterService extends IBaseService {
  GetDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]>;
}
