import { EndpointOptionsInterface } from '../../../../../interfaces/endpoint.interface';

export interface EditGeneralInfoVdcDto extends EndpointOptionsInterface {
  urlParams: EditGeneralInfoVdcParams;
  body: EditGeneralInfoVdcBody;
}

export class EditGeneralInfoVdcParams {
  vdcId: string;
}
export class EditGeneralInfoVdcBody {
  description: string;
}
