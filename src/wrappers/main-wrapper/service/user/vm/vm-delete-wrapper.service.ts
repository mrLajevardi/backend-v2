import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
@Injectable()
export class VmDeleteWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async deleteMedia(authToken: string, mediaId: string): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { mediaId },
    };
    const endpoint = 'VmEndpointService.deleteMediaEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedMedia = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedMedia.headers['location'],
    });
  }
  /**
   * delete media by given id
   * @param {String} authToken
   * @param {String} mediaId
   */
  async deleteTemplate(
    authToken: string,
    templateId: string,
  ): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { templateId },
    };
    const endpoint = 'VmEndpointService.deleteTemplateEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedTemplate = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedTemplate.headers['location'],
    });
  }
  async deleteVApp(authToken: string, vAppId: string): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { vmId: vAppId },
    };
    const endpoint = 'VmEndpointService.deleteVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedVapp = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedVapp.headers['location'],
    });
  }
}
