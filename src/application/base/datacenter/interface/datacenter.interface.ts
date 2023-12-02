import { DatacenterConfigGenResultDto } from '../dto/datacenter-config-gen.result.dto';
import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { DatacenterConfigGenItemsResultDto } from '../dto/datacenter-config-gen-items.result.dto';
import { DatacenterConfigGenItemsQueryDto } from '../dto/datacenter-config-gen-items.query.dto';
import { GetProviderVdcsMetadataDto } from '../../../../wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';
import { FoundDatacenterMetadata } from '../dto/found-datacenter-metadata';
import { DataCenterList } from '../dto/datacenter-list.dto';
import { DatacenterDetails } from '../dto/datacenter-details.dto';
import { CreateDatacenterDto } from '../dto/create-datacenter.dto';

export const BASE_DATACENTER_SERVICE = 'BASE_DATACENTER_SERVICE';

export interface BaseDatacenterService extends IBaseService {
  getDatacenterConfigWithGen(): Promise<DatacenterConfigGenResultDto[]>;

  GetDatacenterConfigWithGenItems(
    query: DatacenterConfigGenItemsQueryDto,
  ): Promise<DatacenterConfigGenItemsResultDto[]>;

  findTargetMetadata(
    metadata: GetProviderVdcsMetadataDto,
  ): FoundDatacenterMetadata;

  getDatacenterMetadata(
    datacenterName: string,
    genId: string,
  ): Promise<FoundDatacenterMetadata>;

  getAllDataCenters(): Promise<DataCenterList[]>;

  getDatacenterDetails(datacenterName: string): Promise<DatacenterDetails>;

  createDatacenter(dto: CreateDatacenterDto): Promise<void>;

  updateDatacenter(dto: CreateDatacenterDto): Promise<void>;

  getDatacenterConfigs(query: any): Promise<any>;
}
