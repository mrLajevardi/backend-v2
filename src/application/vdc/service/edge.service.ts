import { Injectable } from '@nestjs/common';
import { TasksService } from '../../base/tasks/service/tasks.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { OrganizationService } from '../../base/organization/organization.service';
import { ConfigsService } from '../../base/service/configs/configs.service';
import { ServiceInstancesService } from '../../base/service/service-instances/service/service-instances.service';
import { ServiceItemsService } from '../../base/service/service-items/service-items.service';
import { ServicePropertiesService } from '../../base/service/service-properties/service-properties.service';
import { UserService } from '../../base/user/user/user.service';
import { isNil } from 'lodash';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';

@Injectable()
export class EdgeService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceService: ServiceInstancesService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly organizationService: OrganizationService,
  ) {}
  /**
   * @param {String} vdcId
   * @param {Number} ip ip count
   * @param {String} vdcName
   * @param {Object} app
   * @param {String} ServiceInstanceID
   * @param {String} orgId
   * @param {String} userId
   * @return {Promise}
   */
  async createEdge(vdcId, ip, vdcName, ServiceInstanceID, orgId, userId) {
    const sessionToken = await this.sessionService.checkAdminSession(userId);
    const edgeName = vdcName + '_edge';

    const service = await this.serviceInstanceService.findOne({
      where: {
        ID: ServiceInstanceID,
      },
    });
    const checkEdge = await this.checkEdgeExistence(userId, edgeName);
    if (service.status == 2 && !checkEdge) {
      const edgeNameProps = this.servicePropertiesService.findOne({
        where: {
          and: [{ ServiceInstanceID }, { PropertyKey: 'edgeName' }],
        },
      });
      if (edgeNameProps && !isNil(ServiceInstanceID)) {
        await this.servicePropertiesService.deleteAll({
          serviceInstanceId: ServiceInstanceID,
          propertyKey: 'edgeName',
        });
        await this.servicePropertiesService.deleteAll({
          serviceInstanceId: ServiceInstanceID,
          propertyKey: 'edgeIpRange',
        });
      }
    } else if (service.status == 2 && checkEdge) {
      return {
        __vcloudTask: null,
      };
    }
    const edgeGateway = await mainWrapper.admin.edgeGateway
      .createEdgeGateway()
      .createEdge({
        authToken: sessionToken,
        userIpCount: ip,
        name: edgeName,
        vdcId,
      });
    await this.servicePropertiesService.create({
      serviceInstanceId: ServiceInstanceID,
      propertyKey: 'edgeName',
      value: edgeGateway.name,
    });
    for (const ipRange of edgeGateway.ipRange) {
      await this.servicePropertiesService.create({
        serviceInstanceId: ServiceInstanceID,
        propertyKey: 'edgeIpRange',
        value: `${ipRange.startAddress}-${ipRange.endAddress}`,
      });
    }
    return Promise.resolve(edgeGateway);
  }
  /**
   * @param {Object} app
   * @param {String} userId
   * @param {String} edgeName
   * @return {Promise}
   */
  async checkEdgeExistence(userId, edgeName) {
    const org = await this.organizationService.findOne({
      where: { userId },
    });
    const orgId = org.id;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'edgeGateway',
      filter: `name==${edgeName}`,
    });
    if (query.data.record.length > 0) {
      return query.data.record[0];
    }
    return null;
  }
}
