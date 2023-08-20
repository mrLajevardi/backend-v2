import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { CreateNatBody } from './create-nat.dto';

export interface UpdateNatDto extends EndpointOptionsInterface {
  urlParams: UpdateNatUrlParams;
  body: UpdateNatBody;
}

interface UpdateNatUrlParams {
  gatewayId: string;
  natId: string;
}

export class UpdateNatBody extends CreateNatBody {
  id: string;
}
