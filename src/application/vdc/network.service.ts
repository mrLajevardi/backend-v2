import { Injectable } from '@nestjs/common';
import { TasksService } from '../base/tasks/service/tasks.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { OrganizationService } from '../base/organization/organization.service';
import { ConfigsService } from '../base/service/configs/configs.service';
import { ServiceInstancesService } from '../base/service/service-instances/service-instances.service';
import { ServiceItemsService } from '../base/service/service-items/service-items.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { UserService } from '../base/user/user/user.service';
const mainWrapper = require('src/wrappers/mainWrapper/mainWrapper');
const vcdConfig = require('src/wrappers/mainWrapper/vcdConfig');


@Injectable()
export class NetworkService {

    constructor(
        private readonly taskService: TasksService,
        private readonly sessionService: SessionsService,
        private readonly serviceInstanceService: ServiceInstancesService,
        private readonly servicePropertiesService: ServicePropertiesService,
        private readonly serviceItemsService: ServiceItemsService,
        private readonly configService: ConfigsService,
        private readonly organizationService: OrganizationService,
        private readonly userService: UserService,
    ){}


/**
   * @param {String} gateway gateway ip
   * @param {String} vdcId
   * @param {String} orgId
   * @param {Object} app
   * @param {String} edgeName
   * @param {String} userId
   */
async createNetwork(gateway, vdcId, orgId, app, edgeName, userId) {
    const startAddress = '192.168.1.2';
    const endAddress = '192.168.1.11';
    const session = await this.sessionService.checkUserSession(userId,orgId);
    const checkNetwork = await mainWrapper.user.network.getNetwork(session, 1, 25,
        `(ownerRef.id==${vdcId});(name==default-network)`);
    if (checkNetwork.values.length > 0) {
      return;
    }
    return await mainWrapper.user.network.createNetwork({
      name: 'default-network',
      authToken: session,
      dnsServer1: '',
      dnsServer2: '',
      dnsSuffix: '',
      ipRanges: {
        values: [
          {
            startAddress: startAddress,
            endAddress: endAddress,
          },
        ],
      },
      gateway,
      prefixLength: 24,
      vdcId,
      networkType: 'NAT_ROUTED',
      connectionType: vcdConfig.user.network.connectionType,
      connectionTypeValue: vcdConfig.user.network.connectionTypeValue,
    }, edgeName);
  }
}
