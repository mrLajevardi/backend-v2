import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { CreateNamedDiskBody } from 'src/wrappers/vcloud-wrapper/services/user/vdc/dto/create-named-disk.dto';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { AxiosResponse } from 'axios';
import { NamedDiskProperties } from './dto/create-named-disk.dto';
import { GetHardDiskAdaptors } from './dto/get-hard-disk-adaptors.dto';
import { GetNamedDiskDto, Records } from './dto/get-named-disk.dto';
import { GetVdcComputePolicy } from './dto/get-vdc-compute-policy.dto';
import { GetVMAttachedNamedDiskDto } from './dto/get-vm-attached-named-disk.dto';
import * as process from 'process';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
// import process from 'process';
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
  async attachNamedDisk(
    authToken: string,
    nameDiskID: string,
    vmId: string,
  ): Promise<VcloudTask> {
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
  async vcloudQuery<T>(
    authToken: string,
    params: object,
    additionalHeaders: object = {},
  ): Promise<AxiosResponse<T>> {
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
    console.log(wrapper);
    const response = await this.vcloudWrapperService.request<T>(
      wrapper(options),
    );
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
    namedDiskProperties: NamedDiskProperties,
  ): Promise<VcloudTask> {
    const formattedVdcId = vdcId.split(':').slice(-1)[0];
    const vdcStorageProfileLink = `${process.env.VCLOUD_BASE_URL}/api/vdcStorageProfile/${namedDiskProperties.policyId}`;
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
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: getAccept(VcloudAcceptEnum.AllPlusXml),
        },
        urlParams: { vdcId: formattedVdcId },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async detachNamedDisk(
    authToken: string,
    nameDiskID: string,
    vmId: string,
  ): Promise<VcloudTask> {
    const request = {
      disk: {
        href: `${process.env.VCLOUD_BASE_URL}/api/disk/${nameDiskID}`,
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
  async getHardwareInfo(
    authToken: string,
    vdcId: string,
  ): Promise<GetHardDiskAdaptors> {
    const formattedVdcId = vdcId.split(':').slice(-1)[0];
    const endpoint = 'VdcEndpointService.getHardwareInfoEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response =
      await this.vcloudWrapperService.request<GetHardDiskAdaptors>(
        wrapper({
          urlParams: { vdcId: formattedVdcId },
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      );
    return Promise.resolve(response.data);
  }
  async getNamedDisk(authToken: string, vdcId: string): Promise<Records[]> {
    const formattedVdcId = vdcId.split(':').slice(-1);
    const query = await this.vcloudQuery<GetNamedDiskDto>(authToken, {
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
  async getVdcComputePolicy(
    authToken: string,
    vdcId: string,
    page = 1,
    pageSize = 10,
  ): Promise<GetVdcComputePolicy> {
    const params = {
      page,
      pageSize,
    };
    const endpoint = 'VdcEndpointService.getVdcComputePolicyEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response =
      await this.vcloudWrapperService.request<GetVdcComputePolicy>(
        wrapper({
          params,
          urlParams: { vdcId },
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      );
    return Promise.resolve(response.data);
  }
  async getVmAttachedNamedDisk(
    authToken: string,
    namedDiskId: string,
  ): Promise<AxiosResponse<GetVMAttachedNamedDiskDto>> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VdcEndpointService.vmAttachedNamedDisk';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action =
      await this.vcloudWrapperService.request<GetVMAttachedNamedDiskDto>(
        wrapper({
          ...options,
          headers: { Authorization: `Bearer ${authToken}` },
          urlParams: { namedDiskId },
        }),
      );
    return action;
  }
  async removeNamedDisk(
    authToken: string,
    namedDiskId: string,
  ): Promise<VcloudTask> {
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
  async updateNamedDisk(
    authToken: string,
    vdcId: string,
    namedDiskId: string,
    namedDiskProperties: NamedDiskProperties,
  ): Promise<VcloudTask> {
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

  async editGeneralInfo(
    vdcId: string,
    vdcName: string,
    description: string,
    authToken: string,
  ): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const request = {
      'root:Vdc': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          name: vdcName,
        },
        'root:Description': description,
      },
    };

    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);

    const endpoint = 'VdcEndpointService.editGeneralInfo';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        ...options,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vdcId },
        body: xmlRequest,
      }),
    );
    return { __vcloudTask: action.data as string };
  }
}
