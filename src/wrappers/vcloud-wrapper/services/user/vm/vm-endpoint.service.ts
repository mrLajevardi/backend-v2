import { Injectable } from '@nestjs/common';
import {
  EndpointInterface,
  EndpointOptionsInterface,
} from 'src/wrappers/interfaces/endpoint.interface';

@Injectable()
export class VmEndpointService {
  acquireVmTicketEndpoint(
    options: EndpointOptionsInterface,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/screen/action/acquireMksTicket`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  answerEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/question/action/answer`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json',
        ...options.headers,
      },
    };
  }
  createTemplateEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/catalog/${options.urlParams.catalogId}/action/captureVApp`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  createVmEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vdc/${options.urlParams.vdcId}/action/createVm`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  createVmSnapShotEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/createSnapshot`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  deleteMediaEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/media/${options.urlParams.mediaId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  deleteTemplateEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/vAppTemplate/${options.urlParams.templateId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  deleteVmEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/vApp/${options.urlParams.vmId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  deployVmEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/deploy`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  discardSuspendVmEndpoint(
    options: EndpointOptionsInterface,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/discardSuspendedState`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }

  getMediaItemEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/media/${options.urlParams.mediaItemId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  getVmEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/vApp/${options.urlParams.vmId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  getVmTemplatesEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/vAppTemplate/${options.urlParams.vmId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  insertOrEjectEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/media/action/${options.urlParams.action}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  installVmToolsEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/installVMwareTools`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  instantiateVmFromTemplateEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vdc/${options.urlParams.vdcId}/action/instantiateVmFromTemplate`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  partialUploadEndpoint(options?: any) {
    return {
      method: 'put',
      resource: options.urlParams.fullAddress,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/octet-stream',
        ...options.headers,
      },
      additionalConfig: {
        maxRedirects: 0,
      },
    };
  }
  powerOnVmEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/power/action/powerOn`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  questionEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/vApp/${options.urlParams.vmId}/question`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json',
        ...options.headers,
      },
    };
  }
  rebootVmEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/power/action/reboot`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  removeVmSnapShot(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/removeAllSnapshots`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  resetVmEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/power/action/reset`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  revertVmSnapShot(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/revertToCurrentSnapshot`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  suspendVmEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/power/action/suspend`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  undeployVmEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/undeploy`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  updateGuestCustomizationEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/api/vApp/${options.urlParams.vmId}/guestCustomizationSection/`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  updateMediaEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/api/media/${options.urlParams.mediaId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  updateNetworkSectionEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `api/vApp/${options.urlParams.vmId}/networkConnectionSection/`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  updateVAppTemplateEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `api/vAppTemplate/${options.urlParams.templateId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  updateVmEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmId}/action/reconfigureVm`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  uploadFileEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/catalog/${options.urlParams.catalogId}/action/upload`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type':
          'application/vnd.vmware.vcloud.media+json;charset=UTF-8',
        ...options.headers,
      },
    };
  }
}
