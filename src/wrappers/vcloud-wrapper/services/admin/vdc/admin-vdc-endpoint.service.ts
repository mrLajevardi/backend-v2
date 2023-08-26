import { Injectable } from '@nestjs/common';
import { CreateVdcDto } from './dto/create-vdc.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { DeleteVdcDto } from './dto/delete-vdc.dto';
import { DisableVdcDto } from './dto/disable-vdc.dto';
import { EnableVdcDto } from './dto/enable-vdc.dto';
import { UpdateNetworkProfileDto } from './dto/update-network-profile.dto';
import { UpdateVdcDto } from './dto/update-vdc.dto';
import { UpdateVdcStorageProfileDto } from './dto/update-vdc-storage-profile.dto';

@Injectable()
export class AdminVdcEndpointService {
  createVdcEndpoint(options: CreateVdcDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/admin/org/${options.urlParams.orgId}/vdcsparams`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  deleteVdcEndpoint(options: DeleteVdcDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/admin/vdc/${options.urlParams.vdcId[0]}?force=true&recursive=true`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  disableVdcEndpoint(options: DisableVdcDto): EndpointInterface {
    return {
      method: 'post',
      resource: `api/admin/vdc/${options.urlParams.vdcId}/action/disable`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  enableVdcEndpoint(options: EnableVdcDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/admin/vdc/${options.urlParams.vdcId}/action/enable`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  updateNetworkProfileEndpoint(
    options: UpdateNetworkProfileDto,
  ): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/vdcs/${options.urlParams.vdcId}/networkProfile`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateVdcEndpoint(options: UpdateVdcDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/api/admin/vdc/${options.urlParams.vdcId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  updateVdcStorageProfileEndpoint(
    options: UpdateVdcStorageProfileDto,
  ): EndpointInterface {
    return {
      method: 'put',
      resource: options.urlParams.fullUrl,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
}
