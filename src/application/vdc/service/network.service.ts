import { Injectable } from '@nestjs/common';
import { SessionsService } from '../../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';

@Injectable()
export class NetworkService {
  constructor(private readonly sessionService: SessionsService) {}

  /**
   * @param {String} gateway gateway ip
   * @param {String} vdcId
   * @param {String} orgId
   * @param {Object} app
   * @param {String} edgeName
   * @param {String} userId
   */
  async createNetwork(
    gateway: string,
    vdcId: string,
    orgId: number,
    edgeName: string,
    userId: number,
  ) {
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const checkNetwork = await mainWrapper.user.network.getNetwork(
      session,
      1,
      25,
      `(ownerRef.id==${vdcId});(name==default-network)`,
    );
    if (checkNetwork.values.length > 0) {
      return;
    }
    const defaultDnsServer = '4.2.2.4';
    return await mainWrapper.user.network.createNetwork(
      {
        name: 'default-network',
        authToken: session,
        dnsServer1: defaultDnsServer,
        dnsServer2: '',
        dnsSuffix: '',
        ipRanges: {
          values: [],
        },
        gateway,
        prefixLength: 24,
        vdcId,
        networkType: 'NAT_ROUTED',
        connectionType: vcdConfig.user.network.connectionType,
        connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
      },
      edgeName,
    );
  }
}
