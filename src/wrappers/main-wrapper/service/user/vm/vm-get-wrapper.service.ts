import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { GetMediaItemDto } from 'src/wrappers/vcloud-wrapper/services/user/vm/dto/get-media-item.dto';
import { GetVappDto } from './dto/get-vapp-dto';
import { AxiosResponse } from 'axios';
import { GetVappTemplateDto } from './dto/get-vapp-template.dto';
@Injectable()
export class VmGetWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async getMediaItem(
    authToken: string,
    mediaItemId: string,
  ): Promise<GetMediaItemDto> {
    const endpoint = 'VmEndpointService.getMediaItemEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const mediaItem = await this.vcloudWrapperService.request<GetMediaItemDto>(
      wrapper({
        urlParams: { mediaItemId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return mediaItem.data;
  }
  async getQuestion(authToken: string, vmId: string): Promise<object> {
    const endpoint = 'VmEndpointService.questionEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const question = await this.vcloudWrapperService.request<object>(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
      }),
    );
    return question.data;
  }
  getVApp(
    authToken: string,
    vAppId: string,
  ): Promise<AxiosResponse<GetVappDto>> {
    const endpoint = 'VmEndpointService.getVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vApp = this.vcloudWrapperService.request<GetVappDto>(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return vApp;
  }
  getVAppTemplate(
    authToken: string,
    templateId: string,
  ): Promise<AxiosResponse<GetVappTemplateDto>> {
    const endpoint = 'VmEndpointService.getVmTemplatesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vmTemplate = this.vcloudWrapperService.request<GetVappTemplateDto>(
      wrapper({
        urlParams: {
          vmId: templateId,
        },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return vmTemplate;
  }
}
