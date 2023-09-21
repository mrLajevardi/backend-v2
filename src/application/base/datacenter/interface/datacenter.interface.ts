import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';

export interface BaseDatacenterService extends IBaseService {
  getDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]>;

  GetDatacenterConfigWithGenItems(
    query: DatacenterConfigGenItemsQueryDto,
  ): Promise<DatacenterConfigGenItemsResultDto[]>;
}

export type VcloudMetadata = string | number | boolean;
export interface FoundDatacenterMetadata {
  generation: VcloudMetadata | null;
  datacenter: VcloudMetadata | null;
  datacenterTitle: VcloudMetadata | null;
}
