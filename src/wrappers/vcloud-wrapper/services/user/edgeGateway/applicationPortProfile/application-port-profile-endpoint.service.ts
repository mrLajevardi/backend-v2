import { Injectable } from '@nestjs/common';
import { CreateApplicationPortProfilesDto } from './dto/create-application-port-profiles.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { UpdateApplicationPortProfilesDto } from './dto/update-application-port-profiles.dto';
import { DeleteApplicationPortProfilesDto } from './dto/delete-application-port-profile.dto';
import { GetApplicationPortProfilesDto } from './dto/get-application-port-profiles.dto';
import { GetApplicationPortProfilesListDto } from './dto/get-application-port-profiles-list.dto';
import { getAccept } from '../../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../../infrastructure/enum/vcloud-accept.enum';

@Injectable()
export class ApplicationPortProfileEndpointService {
  name: string;
  constructor() {
    this.name = 'ApplicationPortProfileEndpointService';
  }

  createApplicationPortProfilesEndpoint(
    options: CreateApplicationPortProfilesDto,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
        ...options.headers,
      },
    };
  }
  deleteApplicationPortProfilesEndpoint(
    options: DeleteApplicationPortProfilesDto,
  ): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
        ...options.headers,
      },
    };
  }
  getApplicationPortProfileEndpoint(
    options: GetApplicationPortProfilesDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  getApplicationPortProfilesListEndpoint(
    options: GetApplicationPortProfilesListDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/applicationPortProfiles`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  updateApplicationPortProfilesEndpoint(
    options: UpdateApplicationPortProfilesDto,
  ): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
        ...options.headers,
      },
    };
  }
}
