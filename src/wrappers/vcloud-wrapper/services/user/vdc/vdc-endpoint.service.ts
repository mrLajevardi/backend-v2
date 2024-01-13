import { Injectable } from '@nestjs/common';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { AttachNamedDiskOptionsDto } from './dto/attach-named-disk.dto';
import { CreateNamedDiskOptionsDto } from './dto/create-named-disk.dto';
import { DetachNamedDiskOptionsDto } from './dto/detach-named-disk.dto';
import { GetHardwareInfoOptionsDto } from './dto/get-hardware-info.dto';
import { GetVdcComputePolicyDto } from './dto/get-vdc-compute-policy.dto';
import { VmAttachedNamedDiskDto } from './dto/vm-attached-named-disk.dto';
import { RemoveNamedDiskDto } from './dto/remove-named-disk.dto';
import { UpdateNamedDiskDto } from './dto/update-named-disk.dto';
import { VcloudQueryDto } from './dto/vcloud-query.dto';
import { EditGeneralInfoVdcDto } from './dto/edit-general-info-vdc.dto';
import { vcdConfig } from '../../../../mainWrapper/vcdConfig';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

@Injectable()
export class VdcEndpointService {
  name: string;
  constructor() {
    this.name = 'VdcEndpointService';
  }
  attachNamedDisk(options: AttachNamedDiskOptionsDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/disk/action/attach`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  createNamedDisk(options: CreateNamedDiskOptionsDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vdc/${options.urlParams.vdcId}/disk`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }

  editGeneralInfo(options: EditGeneralInfoVdcDto): EndpointInterface {
    return {
      method: 'put',
      resource: `${vcdConfig.baseUrl}/api/vdc/${options.urlParams.vdcId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusXml),
        'Content-Type': 'application/*+xml;charset=UTF-8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',

        ...options.headers,
      },
    };
  }

  detachNamedDisk(options: DetachNamedDiskOptionsDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/disk/action/detach`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  getHardwareInfoEndpoint(
    options: GetHardwareInfoOptionsDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/vdc/${options.urlParams.vdcId}/hwv/vmx-19`,
      params: {},
      body: null,
      headers: {
        'Content-Type': 'application/* +json;',
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  getVdcComputePolicyEndpoint(
    options: GetVdcComputePolicyDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/2.0.0/vdcs/${options.urlParams.vdcId}/computePolicies`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  vmAttachedNamedDisk(options: VmAttachedNamedDiskDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/disk/${options.urlParams.namedDiskId}/attachedVms`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  removeNamedDisk(options: RemoveNamedDiskDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/disk/${options.urlParams.namedDiskId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  updateNamedDisk(options: UpdateNamedDiskDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/api/disk/${options.urlParams.namedDiskId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  vcloudQueryEndpoint(options: VcloudQueryDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/query`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
}
