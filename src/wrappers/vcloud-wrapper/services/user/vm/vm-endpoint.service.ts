import { Injectable } from '@nestjs/common';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { AcquireVmTicketDto } from './dto/acquire-vm-ticket.dto';
import { AnswerDto } from './dto/answer.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CreateVmDto } from './dto/create-vm.dto';
import { CreateVmSnapshotDto } from './dto/create-vm-snap-shot.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { DeleteTemplateDto } from './dto/delete-template.dto';
import { DeleteVmDto } from './dto/delete-vm.dto';
import { DeployVmDto } from './dto/deploy-vm.dto';
import { DiscardSuspendVmDto } from './dto/discard-suspend-vm.dto';
import { GetVmDto } from './dto/get-vm.dto';
import { GetVmTemplatesDto } from './dto/get-vm-templates.dto';
import { InsertOrEjectDto } from './dto/insert-eject.dto';
import { InstallVmToolsDto } from './dto/install-vm-tools.dto';
import { InstantiateVmFromTemplateDto } from './dto/instantiate-vm-from-template.dto';
import { PartialUploadDto } from './dto/partial-upload.dto';
import { PowerOnVmDto } from './dto/power-on-vm.dto';
import { QuestionDto } from './dto/question.dto';
import { RebootVmDto } from './dto/reboot-vm.dto';
import { RemoveVmDto } from './dto/remove-vm.dto';
import { ResetVmDto } from './dto/reset-vm.dto';
import { RevertVmDto } from './dto/revert-vm.dto';
import { SuspendVmDto } from './dto/suspend-vm.dto';
import { UndeployVmDto } from './dto/undeploy-vm.dto';
import { UpdateGuestCustomizationDto } from './dto/update-guest-customazation-dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UpdateVAppTemplateDto } from './dto/update-vapp-template.dto';
import { UpdateVmDto } from './dto/update-vm.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { GetMediaItemDto } from './dto/get-media-item.dto';
import { UpdateNetworkSectionDto } from './dto/update-network-section.dto';

@Injectable()
export class VmEndpointService {
  name: string;
  constructor() {
    this.name = 'VmEndpointService';
  }
  acquireVmTicketEndpoint(options: AcquireVmTicketDto): EndpointInterface {
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
  answerEndpoint(options: AnswerDto): EndpointInterface {
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
  createTemplateEndpoint(options: CreateTemplateDto): EndpointInterface {
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
  createVmEndpoint(options: CreateVmDto): EndpointInterface {
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
  createVmSnapShotEndpoint(options: CreateVmSnapshotDto): EndpointInterface {
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
  deleteMediaEndpoint(options: DeleteMediaDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/media/${options.urlParams.mediaId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  deleteTemplateEndpoint(options: DeleteTemplateDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/vAppTemplate/${options.urlParams.templateId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  deleteVmEndpoint(options: DeleteVmDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/api/vApp/${options.urlParams.vmId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  deployVmEndpoint(options: DeployVmDto): EndpointInterface {
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
  discardSuspendVmEndpoint(options: DiscardSuspendVmDto): EndpointInterface {
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

  getMediaItemEndpoint(options: GetMediaItemDto): EndpointInterface {
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
  getVmEndpoint(options: GetVmDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/vApp/${options.urlParams.vmId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  getVmTemplatesEndpoint(options: GetVmTemplatesDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/vAppTemplate/${options.urlParams.vmId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  insertOrEjectEndpoint(options: InsertOrEjectDto): EndpointInterface {
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
  installVmToolsEndpoint(options: InstallVmToolsDto): EndpointInterface {
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
  instantiateVmFromTemplateEndpoint(
    options: InstantiateVmFromTemplateDto,
  ): EndpointInterface {
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
  partialUploadEndpoint(options: PartialUploadDto): EndpointInterface {
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
  powerOnVmEndpoint(options: PowerOnVmDto): EndpointInterface {
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
  questionEndpoint(options: QuestionDto): EndpointInterface {
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
  rebootVmEndpoint(options: RebootVmDto): EndpointInterface {
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
  removeVmSnapShot(options: RemoveVmDto): EndpointInterface {
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
  resetVmEndpoint(options: ResetVmDto): EndpointInterface {
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
  revertVmSnapShot(options: RevertVmDto): EndpointInterface {
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
  suspendVmEndpoint(options: SuspendVmDto): EndpointInterface {
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
  undeployVmEndpoint(options: UndeployVmDto): EndpointInterface {
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
  updateGuestCustomizationEndpoint(
    options: UpdateGuestCustomizationDto,
  ): EndpointInterface {
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
  updateMediaEndpoint(options: UpdateMediaDto): EndpointInterface {
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
  updateNetworkSectionEndpoint(
    options: UpdateNetworkSectionDto,
  ): EndpointInterface {
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
  updateVAppTemplateEndpoint(
    options: UpdateVAppTemplateDto,
  ): EndpointInterface {
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
  updateVmEndpoint(options: UpdateVmDto): EndpointInterface {
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
  uploadFileEndpoint(options: UploadFileDto): EndpointInterface {
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
