import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { Builder } from 'xml2js';
import { CreateNamedDiskBody } from 'src/wrappers/vcloud-wrapper/services/user/dto/create-named-disk.dto';

@Injectable()
export class VdcWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async attachNamedDisk(authToken: string, nameDiskID: string, vmId: string) {
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
        urlParams: { vmId },
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
  async createNamedDisk(
    authToken: string,
    vdcId: string,
    namedDiskProperties: any,
  ): any {
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
    const formattedVdcId = vdcId.split(':').slice(-1)[0];
    // TODO: این اینترفیس را به فولدر پرنت این فایل انتقال دهید
    const request: CreateNamedDiskBody = {
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
  async detachNamedDisk(authToken, nameDiskID, vmId) {
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
        urlParams: { vmId },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async getHardwareInfo(authToken, vdcId: string) {
    const formattedVdcId = vdcId.split(':').slice(-1)[0];
    const endpoint = 'VdcEndpointService.getHardwareInfoEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vdcId: formattedVdcId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve(response.data);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async getNamedDisk(authToken, vdcId) {
    const formattedVdcId = vdcId.split(':').slice(-1);
    const query: any = await this.vcloudQuery(authToken, {
      type: 'disk',
      format: 'records',
      page: 1,
      pageSize: 128,
      filterEncoded: true,
      links: true,
      filter: `vdc==${formattedVdcId}`,
    });
    return query.data.record;
  }
  /**
   * @param {String} authToken
   * @param {String} vdcId
   * @param {Number} page
   * @param {Number} pageSize
   * @return {Promise}
   */
  async getVdcComputePolicy(authToken, vdcId, page = 1, pageSize = 10) {
    const params = {
      page,
      pageSize,
    };
    const endpoint = 'VdcEndpointService.getVdcComputePolicyEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(
      wrapper({
        params,
        urlParams: { vdcId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve(response.data);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async getVmAttachedNamedDisk(authToken, namedDiskId: string) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VdcEndpointService.vmAttachedNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { namedDiskId },
      }),
    );
    return action;
  }
  /**
   *
   * @param {String} authToken
   * @param {String} nameDiskID
   * @return {Promise}
   */
  async removeNamedDisk(authToken: string, namedDiskId: string) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VdcEndpointService.removeNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { namedDiskId },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vAppId
   * @param {String} vAppAction
   * @return {Promise}
   */
  async updateNamedDisk(authToken, vdcId, namedDiskId, namedDiskProperties) {
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
      'root:Disk': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
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
    };
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      body: xmlRequest,
    };
    const endpoint = 'VdcEndpointService.updateNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { namedDiskId },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
}
