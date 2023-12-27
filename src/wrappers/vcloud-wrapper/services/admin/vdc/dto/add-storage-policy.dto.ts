import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { UpdateVdcStorageProfileBody } from './update-vdc-storage-profile.dto';

export interface AddVdcStorageProfileDto extends EndpointOptionsInterface {
  urlParams: AddVdcStorageProfileUrlParams;
  body: AddVdcStorageProfileBody;
}

interface AddVdcStorageProfileUrlParams {
  vdcId: string;
}

export class AddVdcStorageProfileBody {
  addStorageProfile: UpdateVdcStorageProfileBody[];
}
