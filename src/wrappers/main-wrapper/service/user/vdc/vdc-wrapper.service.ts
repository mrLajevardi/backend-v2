import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { Builder } from 'xml2js';

@Injectable()
export class VdcWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async attachNamedDisk(authToken, nameDiskID, vmID) {
    const request = {
      disk: {
        href: `https://vcd.aradcloud.com/api/disk/${nameDiskID}`,
        type: 'application/vnd.vmware.vcloud.disk+xml',
        vCloudExtension: [],
      },
    };

    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      body: request,
    };
    const endpoint = 'VdcEndpointService.attachNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmID },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {Object} params
   * @param {Object} additionalHeaders
   * @return {Promise}
   */
  async vcloudQuery(authToken, params: any, additionalHeaders = {}) {
    const options = {
      params,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...additionalHeaders,
      },
    };
    const endpoint = 'VdcEndpointService.vcloudQueryEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve(response);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async createNamedDisk(authToken, vdcId, namedDiskProperties) {
    const query: any = await this.vcloudQuery(authToken, {
      type: 'orgVdcStorageProfile',
      format: 'records',
      page: 1,
      pageSize: 128,
      filterEncoded: true,
      links: true,
      filter: `vdc==${vdcId}`,
    });
    const vdcStorageProfileLink = query.data.record[0].href;
    const formattedVdcId = vdcId.split(':').slice(-1);
    const request = {
      'root:DiskCreateParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        },
        'root:Disk': {
          $: {
            name: namedDiskProperties.name,
            busType: namedDiskProperties.busType,
            busSubType: namedDiskProperties.busSubType,
            sizeMb: namedDiskProperties.size,
            sharingType: namedDiskProperties.sharingType,
          },
          'root:Description': namedDiskProperties.description,
          'root:StorageProfile': {
            $: {
              href: vdcStorageProfileLink,
              type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
            },
          },
        },
      },
    };
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      body: xmlRequest,
    };
    const endpoint = 'VdcEndpointService.createNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vdcId: formattedVdcId },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async detachNamedDisk(authToken, nameDiskID, vmID) {
    const request = {
      disk: {
        href: `https://vcd.aradcloud.com/api/disk/${nameDiskID}`,
        type: 'application/vnd.vmware.vcloud.disk+xml',
      },
    };
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      body: request,
    };
    const endpoint = 'VdcEndpointService.detachNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmID },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  getHardwareInfo = async (authToken, vdcId) => {
    const formattedVdcId = vdcId.split(':').slice(-1);
    const response = await new VcloudWrapper().posts(
      'user.vdc.getHardwareInfo',
      {
        urlParams: { vdcId: formattedVdcId },
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );
    return Promise.resolve(response.data);
  };
}
