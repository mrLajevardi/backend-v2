import { Injectable } from '@nestjs/common';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { CreateOrgCatalogDto } from './dto/create-org-catalog.dto';
import { CreateOrgDto } from './dto/create-org.dto';
import { DeleteOrgCatalogDto } from './dto/delete-org-catalog.dto';
import { GetOrgDto } from './dto/get-org.dto';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';

@Injectable()
export class AdminOrgEndpointService {
  name: string;
  constructor() {
    this.name = 'AdminOrgEndpointService';
  }
  createOrgCatalogEndpoint(options: CreateOrgCatalogDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/admin/org/${options.urlParams.orgId}/catalogs`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  createOrgEndpoint(options: CreateOrgDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/orgs`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  deleteOrgCatalogEndpoint(options: DeleteOrgCatalogDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/admin/catalog/${options.urlParams.catalogId}?recursive=true&force=true`,
      body: null,
      params: {},
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  getOrgEndpoint(options: GetOrgDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgs`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
}
