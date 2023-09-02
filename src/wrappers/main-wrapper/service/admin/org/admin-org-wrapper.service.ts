import { Injectable } from '@nestjs/common';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { GetOrgDto } from './dto/get-org.dto';

@Injectable()
export class AdminOrgWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async createOrg(name: string, authToken: string): Promise<CreateOrgDto> {
    const requestBody = {
      ...vcdConfig.admin.org,
      name: name,
      displayName: name,
    };
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: requestBody,
    };
    const endpoint = 'AdminOrgEndpointService.createOrgEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request<
      Omit<CreateOrgDto, '__vcloudTask'>
    >(wrapper(options));
    return Promise.resolve({
      id: response.data.id,
      name: response.data.name,
      __vcloudTask: response.headers['location'],
    });
  }
  async createOrgCatalog(
    authToken: string,
    description: string,
    name = 'user-catalog',
    orgId: string,
  ): Promise<void> {
    const requestBody = {
      name,
      description,
    };
    const filteredOrgId = orgId.split('org:')[1];
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      urlParams: { orgId: filteredOrgId },
      body: requestBody,
    };
    const endpoint = 'AdminOrgEndpointService.createOrgCatalogEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(wrapper(options));
    return;
  }
  deleteCatalog(session: string, catalogId: string): Promise<void> {
    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { catalogId: catalogId },
    };
    const endpoint = 'AdminOrgEndpointService.deleteOrgCatalogEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    this.vcloudWrapperService.request(wrapper(options));
    return;
  }
  async getOrg(params: object, authToken: string): Promise<GetOrgDto> {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params,
    };
    const endpoint = 'AdminOrgEndpointService.getOrgEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request<GetOrgDto>(
      wrapper(options),
    );
    return Promise.resolve(response.data);
  }
}
