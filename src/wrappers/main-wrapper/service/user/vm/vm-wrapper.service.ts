import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { isEmpty } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { Stream } from 'stream';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { UploadFileDto, UploadFileReturnDto } from './dto/upload-file.dto';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { PartialUploadHeaders } from './dto/partial-upload.dto';
import {
  InstantiateVmTemplateDto,
  OrgVdcStorageProfileQuery,
} from './dto/instatiate-vm-from-template.dto';
import { AdminOrgVdcStorageProfileQuery } from './dto/instantiate-vm-from.templates-admin.dto';
import { AcquireTicketDto } from './dto/acquire-vm-ticket.dto';
@Injectable()
export class VmWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly vdcWrapperService: VdcWrapperService,
  ) {}
  async acquireVappTicket(
    authToken: string,
    vAppId: string,
  ): Promise<AxiosResponse<AcquireTicketDto>> {
    const endpoint = 'VmEndpointService.acquireVmTicketEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ticket = await this.vcloudWrapperService.request<AcquireTicketDto>(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId: vAppId },
      }),
    );
    return ticket;
  }
  async deployVApp(authToken: string, vAppId: string): Promise<VcloudTask> {
    const request = {
      'root:DeployVAppParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          forceCustomization: true,
        },
      },
    };
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const endpoint = 'VmEndpointService.deployVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
        body: xmlRequest,
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async discardSuspendedStateVApp(
    authToken: string,
    vAppId: string,
  ): Promise<VcloudTask> {
    const endpoint = 'VmEndpointService.discardSuspendVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async insertOrEjectVappMedia(
    authToken: string,
    vAppId: string,
    insert: boolean,
    mediaName: string | null = null,
    mediaHref: string | null = null,
    mediaId: string | null = null,
  ): Promise<VcloudTask> {
    const request = {
      'root:MediaInsertOrEjectParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        },
      },
    };
    let action = 'ejectMedia';
    if (insert) {
      request['root:MediaInsertOrEjectParams']['root:Media'] = {
        $: {
          href: mediaHref,
          id: mediaId,
          name: mediaName,
        },
      };
      action = 'insertMedia';
    }
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const endpoint = 'VmEndpointService.insertOrEjectEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: {
          vmId: vAppId,
          action,
        },
        headers: { Authorization: `Bearer ${authToken}` },
        body: xmlRequest,
      }),
    );
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
  async installVmTools(authToken: string, vmId: string): Promise<VcloudTask> {
    const endpoint = 'VmEndpointService.installVmToolsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vmId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async instantiateVmFromTemplate(
    authToken: string,
    vdcId: string,
    config: InstantiateVmTemplateDto,
  ): Promise<VcloudTask> {
    const formattedVdcId = vdcId.split(':').slice(-1)[0];
    const computePolicy = await this.vdcWrapperService.getVdcComputePolicy(
      authToken,
      vdcId,
    );
    const computePolicyId = computePolicy.values[0].id;
    const query =
      await this.vdcWrapperService.vcloudQuery<OrgVdcStorageProfileQuery>(
        authToken,
        {
          type: 'orgVdcStorageProfile',
          format: 'records',
          page: 1,
          pageSize: 128,
          filterEncoded: true,
          links: true,
          filter: `vdc==${vdcId}`,
        },
      );
    const vdcStorageProfileLink = query.data.record[0].href;
    const networks = [];
    if (!isEmpty(config.networks)) {
      let index = 0;
      config.networks.forEach((network) => {
        const networkObj = {
          $: { network: network.networkName },
          'root:NetworkConnectionIndex': index,
          'root:IpAddress': network.ipAddress,
          'root:IsConnected': network.isConnected,
          'root:IpAddressAllocationMode': network.allocationMode,
          'root:NetworkAdapterType': network.networkAdaptorType,
        };
        index++;
        networks.push(networkObj);
      });
    }
    const request = {
      'root:InstantiateVmTemplateParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          'xmlns:ns0': 'http://schemas.dmtf.org/ovf/envelope/1',
          name: config.name,
          powerOn: config.powerOn,
        },
        'root:Description': config.description,
        'root:SourcedVmTemplateItem': {
          'root:Source': {
            $: {
              href: config.sourceHref,
              id: config.sourceId,
              name: config.sourceName,
              type: 'application/vnd.vmware.vcloud.vm+xml',
            },
          },
          'root:VmTemplateInstantiationParams': {
            'root:NetworkConnectionSection': {
              'ns0:Info': '',
              'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
              'root:NetworkConnection': networks,
            },
            'root:GuestCustomizationSection': {
              'ns0:Info': 'Specifies Guest OS Customization Settings',
              'root:Enabled': true,
              'root:AdminPasswordAuto': true,
              'root:ComputerName': config.computerName,
            },
          },
          'root:StorageProfile': {
            $: {
              href: vdcStorageProfileLink,
              type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
            },
          },
        },
        'root:AllEULAsAccepted': true,
        'root:ComputePolicy': {
          'root:VmSizingPolicy': {
            $: {
              href: computePolicyId,
              id: computePolicyId,
            },
          },
        },
      },
    };
    const builder = new Builder();
    const xmlRequest = builder.buildObject(request);
    const options = {
      body: xmlRequest,
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vdcId: formattedVdcId },
    };
    const endpoint = 'VmEndpointService.instantiateVmFromTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdVm = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: createdVm.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} vdcId
   * @param {Object} config
   * @param {String} config.name
   * @param {String} config.computerName
   * @param {Boolean} config.primaryNetworkIndex
   * @param {Boolean} config.powerOn
   * @param {Array<Object>} config.networks
   * @param {String} config.networks.allocationMode
   * @param {String} config.networks.networkAdaptorType
   * @param {String} config.networks.ipAddress
   * @param {String} config.networks.networkName
   * @param {String} config.sourceHref
   * @param {String} config.sourceId
   * @param {String} config.sourceName
   */
  async instantiateVmFromTemplateAdmin(
    authToken: string,
    vdcId: string,
    config: InstantiateVmTemplateDto,
    computePolicyId: string,
  ): Promise<VcloudTask> {
    const formattedVdcId = vdcId.split(':').slice(-1)[0];
    const query =
      await this.vdcWrapperService.vcloudQuery<AdminOrgVdcStorageProfileQuery>(
        authToken,
        {
          type: 'adminOrgVdcStorageProfile',
          format: 'records',
          page: 1,
          pageSize: 128,
          filterEncoded: true,
          links: true,
          filter: `vdc==${vdcId}`,
        },
      );
    const vdcStorageProfileLink = query.data.record[0].href;
    const networks = [];
    if (!isEmpty(config.networks)) {
      let index = 0;
      config.networks.forEach((network) => {
        const networkObj = {
          $: { network: network.networkName },
          'root:NetworkConnectionIndex': index,
          'root:IpAddress': network.ipAddress,
          'root:IsConnected': network.isConnected,
          'root:IpAddressAllocationMode': network.allocationMode,
          'root:NetworkAdapterType': network.networkAdaptorType,
        };
        index++;
        networks.push(networkObj);
      });
    }
    const request = {
      'root:InstantiateVmTemplateParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
          'xmlns:ns0': 'http://schemas.dmtf.org/ovf/envelope/1',
          name: config.name,
          powerOn: config.powerOn,
        },
        'root:SourcedVmTemplateItem': {
          'root:Source': {
            $: {
              href: config.sourceHref,
              id: config.sourceId,
              name: config.sourceName,
              type: 'application/vnd.vmware.vcloud.vm+xml',
            },
          },
          'root:VmTemplateInstantiationParams': {
            'root:NetworkConnectionSection': {
              'ns0:Info': '',
              'root:PrimaryNetworkConnectionIndex': config.primaryNetworkIndex,
              'root:NetworkConnection': networks,
            },
            'root:GuestCustomizationSection': {
              'ns0:Info': 'Specifies Guest OS Customization Settings',
              'root:Enabled': true,
              'root:AdminPasswordAuto': true,
              'root:ComputerName': config.computerName,
            },
          },
          'root:StorageProfile': {
            $: {
              href: vdcStorageProfileLink,
              type: 'application/vnd.vmware.vcloud.vdcStorageProfile+xml',
            },
          },
        },
        'root:AllEULAsAccepted': true,
        'root:ComputePolicy': {
          'root:VmPlacementPolicy': {
            $: {
              href: computePolicyId,
              id: computePolicyId,
            },
          },
        },
      },
    };
    const builder = new Builder();

    const xmlRequest = builder.buildObject(request);
    const options = {
      body: xmlRequest,
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vdcId: formattedVdcId },
    };
    const endpoint = 'VmEndpointService.instantiateVmFromTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdVm = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: createdVm.headers['location'],
    });
  }
  async partialUpload(
    authToken: string,
    fullAddress: string,
    data: Stream,
    header: PartialUploadHeaders,
  ): Promise<void> {
    const endpoint = 'VmEndpointService.partialUploadEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { fullAddress },
        headers: { Authorization: `Bearer ${authToken}`, ...header },
        body: data,
      }),
    );
  }
  async postAnswer(
    authToken: string,
    vmId: string,
    questionId: string,
    choiceId: string,
  ): Promise<VcloudTask> {
    const endpoint = 'VmEndpointService.answerEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const answer = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
        body: {
          questionId,
          choiceId,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: answer.headers['location'],
    });
  }
  async powerOnvApp(authToken: string, vAppId: string): Promise<VcloudTask> {
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VmEndpointService.powerOnVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async rebootVm(authToken: string, vmId: string): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId },
    };
    const endpoint = 'VmEndpointService.rebootVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async removeSnapShot(authToken: string, vAppId: string): Promise<VcloudTask> {
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VmEndpointService.removeVmSnapShot';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async resetvApp(authToken: string, vAppId: string): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId: vAppId },
    };
    const endpoint = 'VmEndpointService.resetVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async revertSnapShot(authToken: string, vAppId: string): Promise<VcloudTask> {
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'VmEndpointService.revertVmSnapShot';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async suspendVapp(authToken: string, vAppId: string): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId: vAppId },
    };
    const endpoint = 'VmEndpointService.suspendVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async undeployvApp(
    authToken: string,
    vAppId: string,
    vAppAction: string, // suspend, powerOff, shutdown(shutdown guest)
  ): Promise<VcloudTask> {
    const request = {
      'root:UndeployVAppParams': {
        $: {
          'xmlns:root': 'http://www.vmware.com/vcloud/v1.5',
        },
        'root:UndeployPowerAction': vAppAction,
      },
    };
    const builder = new Builder();

    const xmlRequest = builder.buildObject(request);
    const options = {
      urlParams: { vmId: vAppId },
      headers: { Authorization: `Bearer ${authToken}` },
      body: xmlRequest,
    };
    const endpoint = 'VmEndpointService.undeployVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const action = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: action.headers['location'],
    });
  }
  async uploadFile(
    authToken: string,
    catalogId: string,
    data: UploadFileDto,
  ): Promise<AxiosResponse<UploadFileReturnDto>> {
    const endpoint = 'VmEndpointService.uploadFileEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response =
      await this.vcloudWrapperService.request<UploadFileReturnDto>(
        wrapper({
          urlParams: { catalogId },
          headers: { Authorization: `Bearer ${authToken}` },
          body: data,
        }),
      );
    return response;
  }
}
