import { Injectable } from '@nestjs/common';
import { CreateIpSetsDto } from './dto/create-ip-sets.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { DeleteIpSetsDto } from './dto/delete-ip-sets.dto';
import { UpdateIpSetsDto } from './dto/update-ip-sets.dto';
import { GetIpSetsDto } from './dto/get-ip-sets.dto';
import { GetIpSetsListDto } from './dto/get-ip-sets-list.dto';
import { getAccept } from '../../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../../infrastructure/enum/vcloud-accept.enum';

@Injectable()
export class IpSetsEndpointService {
  name: string;
  constructor() {
    this.name = 'IpSetsEndpointService';
  }

  createIpSetsEndpoint(options: CreateIpSetsDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/firewallGroups`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  deleteIpSetsEndpoint(options: DeleteIpSetsDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  getIpSetsEndpoint(options: GetIpSetsDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getIpSetsListEndpoint(options: GetIpSetsListDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/firewallGroups/summaries`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateIpSetsEndpoint(options: UpdateIpSetsDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
}
