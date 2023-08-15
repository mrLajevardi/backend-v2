import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { Builder } from 'xml2js';
import { isEmpty, isNil } from 'lodash';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { AdminOrgWrapperService } from '../../admin/org/admin-org-wrapper.service';
@Injectable()
export class VmGetWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  /**
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  async getMediaItem(authToken, mediaItemId) {
    const endpoint = 'VmEndpointService.getMediaItemEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const mediaItem = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { mediaItemId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return mediaItem.data;
  }
  getQuestion = async (authToken, vmId) => {
    const endpoint = 'VmEndpointService.questionEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const question = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { vmId },
      }),
    );
    return question.data;
  };
  /**
   * get a single vm
   * @param {String} authToken
   * @param {String} vAppId
   * @return {Promise}
   */
  getVApp(authToken, vAppId) {
    const endpoint = 'VmEndpointService.getVmEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vApp = this.vcloudWrapperService.request(
      wrapper({
        urlParams: { vmId: vAppId },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return vApp;
  }
  getVAppTemplate = (authToken, templateId) => {
    const endpoint = 'VmEndpointService.getVmTemplatesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const vmTemplate = this.vcloudWrapperService.request(
      wrapper({
        urlParams: {
          vmId: templateId,
        },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return vmTemplate;
  };
}
