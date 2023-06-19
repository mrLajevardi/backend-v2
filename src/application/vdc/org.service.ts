import { Injectable } from '@nestjs/common';
import { SessionsService } from '../base/sessions/sessions.service';
import { OrganizationService } from '../base/organization/organization.service';
import { ConfigsService } from '../base/service/configs/configs.service';
import { ServiceInstancesService } from '../base/service/service-instances/service/service-instances.service';
import { ServiceItemsService } from '../base/service/service-items/service-items.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { TasksService } from '../base/tasks/service/tasks.service';
import { UserService } from '../base/user/user/user.service';
import { isEmpty } from 'lodash';
import { Organization } from 'src/infrastructure/database/entities/Organization';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';



@Injectable()
export class OrgService {

    constructor(
        private readonly organizationService: OrganizationService,
    ){}

    async checkOrg(userId) {
        let org : any; 
        org = await this.organizationService.findOne({
          where: {userId},
        });
        if (isEmpty(org)) {
          org = await this.organizationService.initOrg(userId);
         // org.isNew = true;
        } else {
          org = {
          //  isNew: false,
            id: org.id,
            vcloudOrgId: org.orgId,
            name: org.name,
            __vcloudTask: null,
          };
        }
        return Promise.resolve(org);
      };

      
  /**
 * @param {String} userSession
 * @param {String} catalogId
 * @return {Promise}
 */
async deleteCatalogOrg(userSession, catalogId) {
    const deleteCatalog = await mainWrapper.admin.org.deleteCatalog(userSession, catalogId);
    return Promise.resolve({
      __vcloudTask: deleteCatalog.headers['location'],
    });
  }

}
