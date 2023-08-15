import { Injectable } from '@nestjs/common';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { SessionsService } from '../base/sessions/sessions.service';

@Injectable()
export class VgpuDnatService {
  constructor(
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly sessionService: SessionsService,
  ) {}
  async createVgpuDnat(
    serviceId: string,
    edgeName: string,
    externalIP: string,
    internalIP: string,
    typeNat: string,
    externalPort: number,
    portProfileName: string,
    portProfileId: string,
  ): Promise<{ __vcloudTask: object }> {
    const session = await this.sessionService.checkAdminSession();
    const config = {
      enabled: true,
      logging: false,
      priority: 0,
      firewallMatch: 'BYPASS',
      externalAddresses: externalIP,
      internalAddresses: internalIP,
      dnatExternalPort: externalPort,
      name: serviceId + typeNat,
      dnatDestinationAddresses: null,
      applicationPortProfile: { name: portProfileName, id: portProfileId },
      type: typeNat,
      authToken: session,
    };
    const dnet = await mainWrapper.user.nat.createNatRule(config, edgeName);

    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceId,
      propertyKey: 'VgpuExternalPort',
      value: externalPort.toString(),
    });
    return dnet;
  }
}
