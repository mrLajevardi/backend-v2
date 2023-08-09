import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { Builder } from 'xml2js';
import { isNil } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';

@Injectable()
export class VmWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly vdcWrapperService: VdcWrapperService,
  ) {}
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async acquireVappTicket(authToken, vAppId) {
    const endpoint = 'VmEndpointService.acquireVmTicketEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId: vAppId },
        body: {},
      }),
    );
    return ticket;
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {Object} snapShotProperties
   * @return {Promise}
   */
  async createSnapShot(authToken, vAppId, snapShotProperties) {
    const request = {
      'root:CreateSnapshotParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          memory: snapShotProperties.memory,
          quiesce: snapShotProperties.quiesce,
        },
      },
    };
    const builder = new Builder();

    const xmlRequest = builder.buildObject(request);
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
      body: xmlRequest,
    };
    const endpoint = 'VmEndpointService.createVmSnapShotEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   * checks if user-catalog exists
   * @param {String} authToken
   * @return {Promise}
   */
  private async checkCatalog(authToken) {
    const catalogName = 'user-catalog';
    const queryOptions = {
      type: 'catalog',
      page: 1,
      pageSize: 15,
      sortAsc: 'name',
      filter: `name==${catalogName}`,
    };
    const catalogsList: any = await this.vdcWrapperService.vcloudQuery(
      authToken,
      queryOptions,
    );
    let catalogId = null;
    const catalogRecord = catalogsList?.data?.record;
    if (!isNil(catalogRecord) && catalogRecord[0]?.name === catalogName) {
      catalogId = catalogRecord[0].href.split('catalog/')[1];
    }
    return Promise.resolve(catalogId);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} description
   * @param {String} name
   * @param {String} orgId
   * @param {String} containerId
   * @return {Promise}
   */
  async createTemplate(authToken, description, name, orgId, containerId) {
    const check = await this.checkCatalog(authToken);
    let catalogId = check;
    if (isNil(check)) {
      await createOrgCatalog(authToken, '', 'user-catalog', orgId);
      catalogId = await this.checkCatalog(authToken);
    }
    const requestBody = {
      name,
      description,
      source: {
        href: `${VcloudWrapper.baseUrl}/api/vApp/${containerId}`,
      },
      customizeOnInstantiate: true,
    };
    const template = await new VcloudWrapper().posts('user.vm.createTemplate', {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { catalogId },
      body: requestBody,
    });
    return Promise.resolve({
      __vcloudTask: template.headers['location'],
    });
  }
}
