import { BaseResultDto } from '../../../infrastructure/dto/base.result.dto';

export class VdcDetailItemResultDto extends BaseResultDto {
  constructor(
    networkCount: number,
    natRules: number,
    firewalls: number,
    namedDisk: number,
    ipSets: number,
    dhcpForwarding: boolean,
    applicationPortProfiles: { custom: number; default: number },
    media: number,
  ) {
    super();
    this.networks = networkCount;
    this.firewalls = firewalls;
    this.namedDisk = namedDisk;
    this.ipSets = ipSets;
    this.dhcpForwarding = dhcpForwarding;
    this.applicationPortProfiles = applicationPortProfiles;
    this.media = media;
    this.natRules = natRules;
  }
  networks?: number;
  natRules?: number;
  firewalls?: number;
  namedDisk?: number;
  ipSets?: number;
  dhcpForwarding?: boolean;
  applicationPortProfiles?: { custom: number; default: number };
  media?: number;
}
