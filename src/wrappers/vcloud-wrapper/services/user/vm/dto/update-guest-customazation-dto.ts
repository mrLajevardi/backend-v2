import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateGuestCustomizationDto extends EndpointOptionsInterface {
  urlParams: UpdateGuestCustomizationUrlParams;
  body: UpdateGuestCustomizationBody;
}

interface UpdateGuestCustomizationUrlParams {
  vmId: string;
}

export class UpdateGuestCustomizationBody {
  _type: string;
  enabled: boolean;
  changeSid: boolean;
  joinDomainEnabled: boolean;
  useOrgSettings: boolean;
  domainName: string;
  domainUserName: string;
  domainUserPassword: string;
  machineObjectOU: string;
  adminPasswordEnabled: boolean;
  adminPasswordAuto: boolean;
  adminPassword: string;
  adminAutoLogonEnabled: boolean;
  adminAutoLogonCount: number;
  resetPasswordRequired: boolean;
  customizationScript: string;
  computerName: string;
}
