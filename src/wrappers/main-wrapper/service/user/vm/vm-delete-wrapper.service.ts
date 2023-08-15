import { Injectable } from '@nestjs/common';
import { Builder } from 'xml2js';
import { isEmpty, isNil } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { AdminOrgWrapperService } from '../../admin/org/admin-org-wrapper.service';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
@Injectable()
export class VmDeleteWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  /**
   * delete media by given id
   * @param {String} authToken
   * @param {String} mediaId
   */
  async deleteMedia(authToken, mediaId) {
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
  async deleteTemplate(authToken, templateId) {
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
  /**
   * delete vm by given id
   * @param {String} authToken
   * @param {String} vAppId
   */
  async deletevApp(authToken, vAppId) {
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
