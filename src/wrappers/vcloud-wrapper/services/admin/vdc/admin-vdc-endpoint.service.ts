import { Injectable } from '@nestjs/common';
import { CreateVdcDto } from './dto/create-vdc.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { DeleteVdcDto } from './dto/delete-vdc.dto';
import { DisableVdcDto } from './dto/disable-vdc.dto';
import { EnableVdcDto } from './dto/enable-vdc.dto';
import { UpdateNetworkProfileDto } from './dto/update-network-profile.dto';
import { UpdateVdcDto } from './dto/update-vdc.dto';
import { UpdateVdcStorageProfileDto } from './dto/update-vdc-storage-profile.dto';
import { GetProviderVdcsDto } from './dto/get-provider-vdcs.dto';
import { GetProviderVdcMetadataDto } from './dto/get-provider-vdc-metadata.dto';
import { GetProviderVdcDto } from './dto/get-provider-vdc.dto';
import { UpdateProviderVdcMetadataDto } from './dto/update-provider-vdc-metadata.dto';
import { AddVdcStorageProfileDto } from './dto/add-storage-policy.dto';

@Injectable()
export class AdminVdcEndpointService {
  name: string;
  constructor() {
    this.name = 'AdminVdcEndpointService';
  }
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
  addVdcStorageProfileEndpoint(
    options: AddVdcStorageProfileDto,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/admin/vdc/${options.urlParams.vdcId}/vdcStorageProfiles`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=37.1',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }

  getProviderVdcsEndpoint(options: GetProviderVdcsDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/providerVdcs`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=36.3',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  getProviderVdcsMetaDataEndpoint(
    options: GetProviderVdcMetadataDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/admin/providervdc/${options.urlParams.providerVdcId}/metadata`,
      params: null,
      body: null,
      headers: {
        Accept: 'application/*+json;version=36.3',
        ...options.headers,
      },
    };
  }

  getProviderVdcEndpoint(options: GetProviderVdcDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/admin/providervdc/${options.urlParams.providerVdcId}`,
      params: null,
      body: null,
      headers: {
        Accept: 'application/*+json;version=36.3',
        ...options.headers,
      },
    };
  }

  updateProviderVdcMetadataEndpoint(
    options: UpdateProviderVdcMetadataDto,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/admin/providervdc/${options.urlParams.providerVdcId}/metadata`,
      params: null,
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
        Accept: 'application/*+json;version=37.1',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
}
