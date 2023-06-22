import { Injectable } from '@nestjs/common';
import { OrganizationService } from '../../base/organization/organization.service';
import { isEmpty } from 'lodash';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';

@Injectable()
export class OrgService {
  constructor(
    private readonly organizationTable: OrganizationTableService,
    private readonly organizationService: OrganizationService
    ) {}

  async checkOrg(userId) {
    let org: any;
    org = await this.organizationTable.findOne({
      where: { userId },
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
  }

  /**
   * @param {String} userSession
   * @param {String} catalogId
   * @return {Promise}
   */
  async deleteCatalogOrg(userSession, catalogId) {
    const deleteCatalog = await mainWrapper.admin.org.deleteCatalog(
      userSession,
      catalogId,
    );
    return Promise.resolve({
      __vcloudTask: deleteCatalog.headers['location'],
    });
  }
}
