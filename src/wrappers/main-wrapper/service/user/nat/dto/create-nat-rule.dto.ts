import { CreateNatBody } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/nat/dto/create-nat.dto';

export class CreateNatRuleConfig extends CreateNatBody {
  authToken: string;
}
