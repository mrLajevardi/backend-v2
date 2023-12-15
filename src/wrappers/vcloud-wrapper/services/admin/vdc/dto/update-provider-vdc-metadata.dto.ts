import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { MetadataEntry } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/get-provider-vdcs-metadata.dto';

export interface UpdateProviderVdcMetadataDto extends EndpointOptionsInterface {
  urlParams: UpdateProviderVdcMetadataUrlParams;
  body: UpdateProviderVdcMetadataBody;
}

interface UpdateProviderVdcMetadataUrlParams {
  providerVdcId: string;
}
export interface UpdateProviderVdcMetadataBody {
  metadataEntry: MetadataEntry[];
}
