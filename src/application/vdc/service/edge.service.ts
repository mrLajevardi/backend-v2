import { Injectable } from '@nestjs/common';
import { TasksService } from '../../base/tasks/service/tasks.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { OrganizationService } from '../../base/organization/organization.service';
import { UserService } from '../../base/user/service/user.service';
import { isNil } from 'lodash';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';

@Injectable()
export class EdgeService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceTable: ServiceInstancesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly organizationTable: OrganizationTableService,
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
  async createEdge(vdcId, ip, vdcName, serviceInstanceId, orgId, userId) {
    const sessionToken = await this.sessionService.checkAdminSession();
    const edgeName = vdcName + '_edge';

    const service = await this.serviceInstanceTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    const checkEdge = await this.checkEdgeExistence(userId, edgeName);
    if (service.status == 2 && !checkEdge) {
      const edgeNameProps = this.servicePropertiesTable.findOne({
        where: {
          serviceInstanceId,
          propertyKey: 'edgeName',
        },
      });
      if (edgeNameProps && !isNil(serviceInstanceId)) {
        await this.servicePropertiesTable.deleteAll({
          serviceInstanceId,
          propertyKey: 'edgeName',
        });
        await this.servicePropertiesTable.deleteAll({
          serviceInstanceId,
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
    console.log('🥞');
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'edgeName',
      value: edgeGateway.name,
    });
    for (const ipRange of edgeGateway.ipRange) {
      await this.servicePropertiesTable.create({
        serviceInstanceId,
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
    const org = await this.organizationTable.findOne({
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
