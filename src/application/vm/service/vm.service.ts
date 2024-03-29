import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { isNil } from 'lodash';
import { ItemTypesTableService } from 'src/application/base/crud/item-types-table/item-types-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { createOrgCatalog } from 'src/wrappers/mainWrapper/admin/org/createOrgCatalog';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { CreateVmFromTemplate } from '../dto/create-vm-from-template.dto';
import { VmList } from '../dto/get-all-user-vm.dto';
import { VmTemplateList } from '../dto/templates.dto';
import { VmDiskSection } from '../dto/disk-section.dto';
import { ExceedEnoughDiskCountException } from '../exceptions/exceed-enough-disk-count.exception';
import { groupBy } from '../../../infrastructure/utils/extensions/array.extensions';
import { DiskBusUnitBusNumberSpace } from '../../../wrappers/mainWrapper/user/vm/diskBusUnitBusNumberSpace';
import { CreateVm } from '../dto/create-vm.dto';
import { VmTicket } from '../dto/vm-ticket.dto';
import { CatalogMedia } from '../dto/catalog-media.dto';
import { VmGeneralSection } from '../dto/vm-general-section.dto';
import {
  HardDiskAdapter,
  HardwareInfo,
  OperatingSystem,
  OsFamily,
} from '../dto/hardware-info.dto';
import { VmMedia } from '../dto/get-media.dto';
import { VmOsInfo } from '../dto/os-info.dto';
import { VmRemovableMedia } from '../dto/vm-removableMedia.dto';
import {
  VmComputeSection,
  VmGuestCustomization,
  VmQuery,
  VmSupportedHardDiskAdaptors,
} from '../dto/vm.dto';
import { SnapShotDetails } from '../dto/snap-shot-details.dto';
import * as process from 'process';
import { VmDetailService } from './vm-detail.service';
import { VmStatusEnum } from '../enums/vm-status.enum';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { VmWrapperService } from 'src/wrappers/main-wrapper/service/user/vm/vm-wrapper.service';
import { UploadFileDto } from '../dto/upload-file-info.dto';
import { UploadFileReturnDto } from 'src/wrappers/main-wrapper/service/user/vm/dto/upload-file.dto';
import { DiskItemCodes } from '../../base/itemType/enum/item-type-codes.enum';
import { GetCodeDisk } from '../../vdc/utils/disk-functions.utils';
import { PaygServiceService } from '../../base/service/services/payg-service.service';
import { NotEnoughCreditException } from '../../../infrastructure/exceptions/not-enough-credit.exception';
import { BaseFactoryException } from '../../../infrastructure/exceptions/base/base-factory.exception';
import { VmDetailFactoryService } from './vm-detail.factory.service';
import { VcloudSectionTypeEnum } from '../../../infrastructure/enum/vcloud-sectionType.enum';
import { VmGetWrapperService } from '../../../wrappers/main-wrapper/service/user/vm/vm-get-wrapper.service';
import { TemplateNetworkSection } from '../dto/template-network-section.dto';

@Injectable()
export class VmService {
  static mainWrapper: any;
  // static createVmFromTemplate(
  //   options: { user: { userId: string }; locals: object },
  //   data: {
  //     templateId: string;
  //     computerName: string;
  //     name: string;
  //     primaryNetwork: number;
  //     networks: any[];
  //     powerOn: boolean;
  //     description: string;
  //     templateName: string;
  //   },
  //   vdcInstanceId: string,
  // ) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionsServices: SessionsService,
    private readonly servicePropertiesTableService: ServicePropertiesTableService,
    private readonly organizationTableService: OrganizationTableService,
    private readonly loggerService: LoggerService,
    private readonly itemTypesTableService: ItemTypesTableService,
    private readonly paygService: PaygServiceService,
    private readonly vmWrapperService: VmWrapperService,
    private readonly vmDetailFactoryService: VmDetailFactoryService,
    private readonly vmGetWrapperService: VmGetWrapperService,
  ) {}

  async acquireVMTicket(options, vdcInstanceId, vAppId): Promise<VmTicket> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        vdcInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    console.log(vdcInstanceId, vAppId);
    const ticket = await mainWrapper.user.vm.acquireVappTicket(session, vAppId);
    return Promise.resolve({
      ticket: ticket.data.ticket || null,
    });
  }

  async createTemplate(
    options,
    serviceInstanceId: string,
    containerId: string,
    data: CreateTemplateDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const serviceOrg = await this.servicePropertiesTableService.findOne({
      where: {
        serviceInstanceId,
        propertyKey: 'orgId',
      },
    });
    const orgId = parseInt(serviceOrg.value);
    const vcloudOrgId = await this.organizationTableService.findOne({
      where: {
        id: orgId,
      },
    });
    const session = await this.sessionsServices.checkUserSession(userId, orgId);
    const template = await mainWrapper.user.vm.createTemplate(
      session,
      data.description,
      data.name,
      vcloudOrgId.orgId,
      containerId,
    );
    await this.loggerService.info(
      'vm',
      'createTemplate',
      {
        _object: template.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: template.__vcloudTask.split('task/')[1],
    });
  }

  async createVMFromTemplate(
    options,
    data: CreateVmFromTemplate,
    vdcInstanceId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        vdcInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const sourceHref =
      vcdConfig.baseUrl + '/api/vAppTemplate/' + data.templateId;
    const createdVm = await mainWrapper.user.vm.instantiateVmFromTemplate(
      session,
      props.vdcId,
      {
        computerName: data.computerName,
        name: data.name,
        primaryNetworkIndex: data.primaryNetworkIndex,
        networks: data.networks,
        powerOn: data.powerOn,
        description: data.description,
        sourceHref: sourceHref,
        sourceId: data.templateId,
        sourceName: data.templateName,
        storage: data.storage,
      },
    );
    await this.loggerService.info(
      'vm',
      'createVmFromTemplate',
      {
        _object: createdVm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: createdVm.__vcloudTask.split('task/')[1],
    });
  }

  async createVm(
    options,
    data: CreateVm,
    serviceInstanceId: string,
  ): Promise<TaskReturnDto | any> {
    if ((data.storage as []).length > 4) {
      return new ExceedEnoughDiskCountException();
    }
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const itemTypes = await this.itemTypesTableService.find({
      where: {
        serviceTypeId: 'vm',
      },
    });
    for (const itemType of itemTypes) {
      const dictionary = {
        storage: 'storage',
        cpuCore: 'cpuNumber',
        ram: 'ram',
      };
      const convertedItemType = dictionary[itemType.code];
      console.log(parseInt(data[convertedItemType]) > itemType.maxPerRequest);
      if (parseInt(data[convertedItemType]) > itemType.maxPerRequest) {
        throw new BadRequestException();
      }
    }
    const createdVm = await mainWrapper.user.vm.createVm(session, props.vdcId, {
      computerName: data.computerName,
      coreNumber: data.coreNumber,
      cpuNumber: data.cpuNumber,
      mediaName: data.mediaName,
      mediaHref: data.mediaHref,
      name: data.name,
      primaryNetworkIndex: data.primaryNetworkIndex,
      osType: data.osType,
      ram: data.ram,
      storage: data.storage,
      networks: data.networks,
      powerOn: data.powerOn,
      description: data.description,
    });
    await this.loggerService.info(
      'vm',
      'createVm',
      {
        _object: createdVm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: createdVm.__vcloudTask.split('task/')[1],
    });
  }

  async createVmSnapShot(
    options,
    serviceInstanceId: string,
    vAppId: string,
    data: CreateVmFromTemplate,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const serviceOrg = await this.servicePropertiesTableService.findOne({
      where: {
        serviceInstanceId,
        propertyKey: 'orgId',
      },
    });
    const orgId = parseInt(serviceOrg.value);
    const session = await this.sessionsServices.checkUserSession(userId, orgId);
    const snapShot = await mainWrapper.user.vm.createSnapShot(
      session,
      vAppId,
      data,
    );
    await this.loggerService.info(
      'vm',
      'createSnapshot',
      {
        _object: snapShot.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: snapShot.__vcloudTask.split('task/')[1],
    });
  }

  async deleteMedia(
    options,
    serviceInstanceId: string,
    mediaId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const media = await mainWrapper.user.vm.deleteMedia(session, mediaId);
    await this.loggerService.info(
      'vm',
      'deleteMedia',
      {
        _object: media.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: media.__vcloudTask.split('task/')[1],
    });
  }

  async deleteTemplate(
    options,
    serviceInstanceId: string,
    templateId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const template = await mainWrapper.user.vm.deleteTemplate(
      session,
      templateId,
    );
    await this.loggerService.info(
      'vm',
      'deleteTemplate',
      {
        _object: template.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: template.__vcloudTask.split('task/')[1],
    });
  }

  async deleteVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    this.paygService.checkAllVdcVmsEvents();

    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.deleteVm(session, vAppId);
    await this.loggerService.info(
      'vm',
      'deleteVm',
      {
        _object: vm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vm.__vcloudTask.split('task/')[1],
    });
  }

  async deployVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.deployVm(session, vAppId);
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async discardSuspendVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.discardSuspendVm(session, vAppId);
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async ejectMedia(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.insertOrEjectVappMedia(
      session,
      vAppId,
      false,
    );
    await this.loggerService.info(
      'vm',
      'ejectMedia',
      {
        _object: action.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async getAllUserVm(
    options,
    serviceInstanceId: string,
    filter = '',
    search = '',
  ): Promise<VmList> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );

    if (props.vdcId == null)
      return { values: [], page: 0, pageSize: 0, pageCount: 0, total: 0 };

    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    if (filter !== '') {
      filter = `(isVAppTemplate==false;vdc==${props.vdcId});` + `(${filter})`;
    } else {
      filter = `(isVAppTemplate==false;vdc==${props.vdcId})`;
    }
    if (search) {
      filter = filter + `;(name==*${search}*,guestOs==*${search}*)`;
    }
    const vmList = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'vm',
      filter,
    });

    console.log(vmList);

    const vmValues = [];
    for (const recordItem of vmList.data.record) {
      const id = recordItem.href.split('vApp/')[1];
      const name = recordItem.name;
      const vmToolsVersion = recordItem.otherAttributes?.vmToolsVersion;
      const os = recordItem.guestOs;
      const description = recordItem.description;
      const cpu = recordItem.numberOfCpus;
      const storage = recordItem.totalStorageAllocatedMb - recordItem.memoryMB;
      const memory = recordItem.memoryMB;

      const status = VmStatusEnum[recordItem.status];

      const containerId = recordItem.container.split('vApp/')[1];

      const countOfNetworks = await this.getCountOfNetworksVm(
        recordItem,
        options,
        serviceInstanceId,
        id,
      );

      vmValues.push({
        id,
        name,
        os,
        cpu,
        storage,
        memory,
        vmToolsVersion,
        description,
        status,
        containerId,
        snapshot: recordItem.snapshot,
        countOfNetworks,
      });
    }
    const data = {
      total: vmList.data.total,
      pageSize: vmList.data.pageSize,
      page: vmList.data.page,
      pageCount: Math.floor(vmList.data.total / vmList.data.pageSize) + 1,
      values: vmValues,
    };
    return Promise.resolve(data);
  }

  private async getCountOfNetworksVm(
    recordItem,
    options,
    serviceInstanceId: string,
    id,
  ) {
    const forbiddenStatusVmsList = [
      VmStatusEnum[VmStatusEnum.FAILED_CREATION],
      VmStatusEnum[VmStatusEnum.UNKNOWN],
      VmStatusEnum[VmStatusEnum.UNRESOLVED],
    ];
    return forbiddenStatusVmsList.includes(recordItem.status)
      ? 0
      : (await this.getVmNetworkSection(options, serviceInstanceId, id))
          .networkConnections.length;
  }

  async getAllUserVmTemplates(
    options,
    serviceInstanceId: string,
  ): Promise<VmTemplateList[]> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const templateList = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'vm',
      filter: 'isVAppTemplate==true',
    });
    const data = [];
    for (const recordItem of templateList.data.record) {
      const id = recordItem.href.split('vAppTemplate/')[1];
      const container = recordItem.container.split('vAppTemplate/')[1];
      let templateNICCount = 0;
      let numCoresPerSocket = 0;
      const templateCompleteInfo = await mainWrapper.user.vm.getVappTemplate(
        session,
        id,
      );
      for (const section of templateCompleteInfo.data.section) {
        if (section._type == 'NetworkConnectionSectionType') {
          templateNICCount = section.networkConnection.length;
        }
        if (section._type == 'VmSpecSectionType') {
          numCoresPerSocket = section.numCoresPerSocket;
        }
      }
      const {
        totalStorageAllocatedMb,
        containerName: name,
        guestOs: os,
        ownerName,
        numberOfCpus: cpu,
        catalogName: catalog,
        memoryMB: memory,
        status,
        dateCreated,
        autoDeleteDate,
        isExpired,
      } = recordItem;
      data.push({
        id,
        container,
        ownerName,
        name,
        os,
        cpu,
        memory,
        catalog,
        templateNICCount,
        numCoresPerSocket,
        sockets: cpu / numCoresPerSocket,
        totalStorageAllocatedMb,
        status: VmStatusEnum[status],
        dateCreated,
        autoDeleteDate,
        isExpired,
      });
    }
    return Promise.resolve(data);
  }

  async getCatalogMedias(
    options,
    serviceInstanceId: string,
    page: number,
    pageSize: number,
  ): Promise<CatalogMedia> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const catalogMedias = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'media',
      page,
      pageSize,
      filter: '((catalogName==user-catalog))',
    });
    const records = catalogMedias.data.record;
    let filteredData = [];
    filteredData = records.map((record) => {
      return {
        id: record.href.split('/').slice(-1)[0],
        taskId: record.otherAttributes.task.split('/task')[1],
        name: record.name,
        isBusy: record.isBusy,
        storageB: record.storageB,
        status: record.status,
        creationDate: record.creationDate,
      };
    });
    return Promise.resolve({
      total: catalogMedias.data.total,
      page: catalogMedias.data.page,
      pageSize: catalogMedias.data.pageSize,
      records: filteredData,
    });
  }

  async getVmDiskSection(
    options,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<VmDiskSection[]> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );

    const storageProfile = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'orgVdcStorageProfile',
      page: 1,
      pageSize: 128,
      filter: `vdc==${props.vdcId.split('vdc:')[1]}`,
    });
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);
    const vmSpecSection = vm.data.section.find(
      (section) => section._type === 'VmSpecSectionType',
    );
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    const data = [];
    vmSpecSection.diskSection.diskSettings.forEach((settings) => {
      const targetAdaptor = hardwareInfo.hardDiskAdapter.find(
        (diskAdaptor) => diskAdaptor.legacyId == settings.adapterType,
      );

      const storageId = (settings.storageProfile.id as string).split(':')[3];
      const storageName = settings.storageProfile.name as string;
      let storageCode = '';

      storageCode = GetCodeDisk(storageName);

      const diskSection = {
        id: settings.diskId.toString(),
        name: settings.disk === null ? null : settings.disk.name,
        iopLimit: storageProfile.data.record[0].iopsLimit,
        diskIopsEnabled: storageProfile.data.record[0].diskIopsEnabled,
        unitNumber: settings.unitNumber,
        busNumber: settings.busNumber,
        adapterType: {
          name: targetAdaptor.name,
          legacyId: targetAdaptor.legacyId,
        },
        isNamedDisk: settings.disk === null ? false : true,
        shareable: settings.shareable,
        iops: settings.iops,
        sizeMb: settings.sizeMb,
        storageType: {
          storageId,
          storageName,
          code: storageCode.toLowerCase(),
        },
        isDefault: false,
      };
      data.push(diskSection);
    });
    if (data[0]) {
      data[0].isDefault = true;
    }
    return Promise.resolve(data);
  }

  async getSnapShotDetails(
    options: SessionRequest,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<SnapShotDetails> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);

    const snapshotSection = vm.data.section.filter(
      (d) => d._type == 'SnapshotSectionType',
    )[0];

    const snapShotInf: SnapShotDetails = {
      snapShotTime: snapshotSection?.snapshot?.created,
      snapShotSize: snapshotSection?.snapshot?.size,
    };

    return Promise.resolve(snapShotInf);
  }

  async getVmGeneralSection(
    options,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<VmGeneralSection> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);
    const vmList = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'vm',
      filter: `id==${vmId}`,
    });

    const mediasList = vm.data.section
      .find((sec) => sec._type == 'VmSpecSectionType')
      .mediaSection.mediaSettings.filter(
        (media) => media.mediaState !== 'DISCONNECTED',
      );
    // .map((img) => img.mediaImage.name as string);

    const medias = vm.data.section
      .find((sec) => sec._type == 'VmSpecSectionType')
      .mediaSection.mediaSettings.filter(
        (media) => media.mediaState !== 'DISCONNECTED',
      )
      .map((img) => (img.mediaImage ? img.mediaImage.name : 'بهینه ساز')); //Mr.Khalili siad this should be 'بهینه ساز'

    const data: any = {
      name: vm.data.name,
      description: vm.data.description,
      bootDelay: vm.data?.bootOptions?.bootDelay ?? 0,
      enterBIOSSetup: vm.data?.bootOptions?.enterBIOSSetup,
      status: VmStatusEnum[vmList.data.record[0].status],
      snapshot: vmList.data.record[0].snapshot,
      containerId: vmList.data.record[0].container.split('vApp/')[1],
    };
    data.medias = medias;

    vm.data.section.forEach((section) => {
      if (section._type === 'OperatingSystemSectionType') {
        data.osType =
          section.otherAttributes['{http://www.vmware.com/schema/ovf}osType'];
      }
      if (section._type === 'GuestCustomizationSectionType') {
        data.computerName = section.computerName;
      }
      if (section._type === 'VmSpecSectionType') {
        data.vmToolsVersion = section.vmToolsVersion;
      }
    });
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    hardwareInfo.supportedOperatingSystems.operatingSystemFamilyInfo.forEach(
      (osFamily) => {
        osFamily.operatingSystem.forEach((os) => {
          if (os.internalName === data.osType) {
            data.osFamily = osFamily.name;
            data.osName = os.name;
          }
        });
      },
    );
    return Promise.resolve(data);
  }

  async getHardwareInfo(
    options,
    serviceInstanceId: string,
  ): Promise<HardwareInfo[]> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vdcData = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );

    const hardwareInfoForFront: HardwareInfo[] = [];
    const osFamily: OsFamily[] = [];
    const hardDiskAdapter: HardDiskAdapter[] = [];
    const operatingSystem: OperatingSystem[] = [];

    const maxCoresPerSocket: number = vdcData.maxCoresPerSocket;
    const maxMemorySizeMb: number = vdcData.maxMemorySizeMb;
    const maxCPUs: number = vdcData.maxCPUs;
    const supportedMemorySizeGb: number[] = vdcData.supportedMemorySizeGb;

    vdcData.supportedOperatingSystems.operatingSystemFamilyInfo.forEach(
      (element) => {
        const name = element.name;
        const operatingSystemFamilyId = element.operatingSystemFamilyId;
        element.operatingSystem.forEach((el) => {
          const supportedHardDiskAdapter = el.supportedHardDiskAdapter;
          const name = el.name;
          const internalName = el.internalName;
          const supportedNICType = el.supportedNICType;
          const defaultHardDiskAdapterType = el.defaultHardDiskAdapterType;

          operatingSystem.push({
            supportedHardDiskAdapter,
            name,
            internalName,
            supportedNICType,
            defaultHardDiskAdapterType,
          });
        });

        osFamily.push({
          name,
          operatingSystem,
          operatingSystemFamilyId,
        });
      },
    );
    vdcData.hardDiskAdapter.forEach((element) => {
      const id = element.id;
      const legacyId = element.legacyId;
      const name = element.name;
      hardDiskAdapter.push({
        id,
        legacyId,
        name,
      });
    });

    hardwareInfoForFront.push({
      maxCoresPerSocket,
      maxMemorySizeMb,
      maxCPUs,
      supportedMemorySizeGb,
      osFamily,
      hardDiskAdapter,
    });

    return Promise.resolve(hardwareInfoForFront);
  }

  async getMedia(options, serviceInstanceId: string): Promise<VmMedia[]> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vdcData = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'media',
      format: 'records',
      page: 1,
      pageSize: 128,
    });

    const mediaInfo = [];
    vdcData.data.record.forEach((element) => {
      const href = element.href;
      const name = element.name;
      mediaInfo.push({
        name,
        href,
      });
    });
    return Promise.resolve(mediaInfo);
  }

  async getOsInfo(options, serviceInstanceId: string): Promise<VmOsInfo> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    const data: VmOsInfo = {
      // MicrosoftWindows: [],
    };
    hardwareInfo.supportedOperatingSystems.operatingSystemFamilyInfo.forEach(
      (osFamily) => {
        data[osFamily.name] = [];
        osFamily.operatingSystem.forEach((os) => {
          data[osFamily.name].push({
            osName: os.name,
            osType: os.internalName,
          });
        });
      },
    );
    return Promise.resolve(data);
  }

  async getQuestion(options, serviceInstanceId: string, vmId: string) {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const question = await mainWrapper.user.vm.getQuestion(session, vmId);
    let questionText = null;
    // try {
    //   const translatedQuestion = await axios.post(
    //     'http://172.20.51.101:3000/translate',
    //     {
    //       text: question.question,
    //       lang: 'fa',
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.ARAD_TRANSLATION_TOKEN}`,
    //       },
    //     },
    //   );
    //   questionText = translatedQuestion.data.translatedText;
    // } catch (err) {
    // }
    questionText = question.question;
    // console.log(question.choices, question.questionId, questionText);

    return Promise.resolve({
      choices: question.choices,
      questionId: question.questionId,
      question: questionText,
    });
  }
  async getVmRemovableMedia(
    options,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<VmRemovableMedia[]> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);
    const data = vm.data;
    const VmSpecSectionType = data.section.filter(
      (section) => section._type === 'VmSpecSectionType',
    )[0];
    const mediaSettings = VmSpecSectionType.mediaSection.mediaSettings;
    const removableMedia = mediaSettings.map((media) => {
      return {
        mediaState: media.mediaState,
        mediaType: media.mediaType,
        mediaName: media?.mediaImage?.name || null,
      };
    });
    return Promise.resolve(removableMedia);
  }

  async getSupportedHardDiskAdaptors(
    options,
    serviceInstanceId: string,
    osType: string | undefined,
  ): Promise<VmSupportedHardDiskAdaptors[]> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    const adaptors = {};
    hardwareInfo.hardDiskAdapter.forEach((adaptor) => {
      const busNumberRanges = adaptor.busNumberRanges.range.map((range) => {
        return {
          begin: range.begin,
          end: range.end,
        };
      });
      const unitNumberRanges = adaptor.unitNumberRanges.range.map((range) => {
        return {
          begin: range.begin,
          end: range.end,
        };
      });
      console.log(adaptor.id);
      if (adaptor.legacyId == 6 || adaptor.legacyId == 7) {
        adaptors[adaptor.id] = {
          id: adaptor.id,
          busNumberRanges,
          legacyId: adaptor.legacyId,
          name: adaptor.name,
          reservedBusUnitNumber: adaptor.reservedBusUnitNumber,
          unitNumberRanges,
        };
      }
    });
    // const osAdaptors = [];
    // if (isNil(osType)) {
    // }
    return Object.keys(adaptors).map((key) => {
      return adaptors[key];
    });
    // hardwareInfo.supportedOperatingSystems.operatingSystemFamilyInfo.forEach((osFamily) => {
    //   osFamily.operatingSystem.forEach((os) => {
    //     if (os.internalName === osType) {
    //       os.supportedHardDiskAdapter.forEach((adaptor) => {
    //         if (!isNil(adaptors[adaptor.ref])) {
    //           osAdaptors.push(adaptors[adaptor.ref]);
    //         }
    //       });
    //     }
    //   });
    // });
    // return Promise.resolve(osAdaptors);
  }

  async getTemplateAdaptors(options, serviceInstanceId, templateId) {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vmTemplate = await mainWrapper.user.vm.getVappTemplate(
      session,
      templateId,
    );
    const data = vmTemplate.data;
    let osType = null;
    for (const section of data.section) {
      if (section._type === 'VmSpecSectionType') {
        osType = section.osType;
      }
    }
    const suppertedNetworkAdaptors = [];
    let recommendedNetworkAdaptor = null;
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    for (const osFamily of hardwareInfo.supportedOperatingSystems
      .operatingSystemFamilyInfo) {
      for (const operatingSystem of osFamily.operatingSystem) {
        if (operatingSystem.internalName === osType) {
          operatingSystem.supportedNICType.forEach((nic) => {
            suppertedNetworkAdaptors.push(nic.name);
          });
          recommendedNetworkAdaptor = operatingSystem.recommendedNIC.name;
        }
      }
    }
    return Promise.resolve({
      suppertedNetworkAdaptors,
      recommendedNetworkAdaptor,
    });
  }

  async getNetworksVappTemplate(
    options: SessionRequest,
    vdcInstanceId: string,
    templateId: string,
  ): Promise<TemplateNetworkSection[]> {
    const vapp = await this.getVAppTemplate(options, vdcInstanceId, templateId);
    const networks = vapp.section?.find(
      (sec) => sec._type == VcloudSectionTypeEnum.Network,
    );
    const networkData: TemplateNetworkSection[] =
      networks.networkConnection.map((item) => {
        const isPrimary =
          item.networkConnectionIndex ===
          networks.primaryNetworkConnectionIndex;
        return {
          ipAddressAllocationMode: item.ipAddressAllocationMode,
          isConnected: item.isConnected,
          networkConnectionIndex: item.networkConnectionIndex,
          network: item.network,
          needsCustomization: item.needsCustomization,
          macAddress: item.macAddress,
          networkAdapterType: item.networkAdapterType,
          isPrimary,
        };
      });
    // networks = networks.networkConnection;
    return networkData;
  }

  async getVAppTemplate(options, serviceInstanceId, templateId) {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vmTemplate = await this.vmGetWrapperService.getVAppTemplate(
      session,
      templateId,
    );
    const data = vmTemplate.data;
    // const { status, name, description, dateCreated } = data;
    // const filteredData = {
    //   status,
    //   name,
    //   description,
    //   dateCreated,
    // };
    return Promise.resolve(data);
  }

  async getVmComputeSection(
    options,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<VmComputeSection> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);
    const data = vm.data;
    const sections: any = {};
    data.section.forEach((section) => {
      if (section._type === 'VmSpecSectionType') {
        sections[section._type] = section;
      }
    });
    const vmSpec = sections.VmSpecSectionType;
    const osType = vmSpec.osType;
    const numCpus = vmSpec.numCpus;
    const numCoresPerSocket = vmSpec.numCoresPerSocket;
    const memory = vmSpec.memoryResourceMb.configured;
    const nestedHypervisorEnabled = data.nestedHypervisorEnabled;
    const memoryHotAddEnabled = data.vmCapabilities.memoryHotAddEnabled;
    const cpuHotAddEnabled = data.vmCapabilities.cpuHotAddEnabled;
    const computeSectionData: any = {
      numCpus,
      numCoresPerSocket,
      memory,
      nestedHypervisorEnabled,
      memoryHotAddEnabled,
      cpuHotAddEnabled,
      numberOfSockets: numCpus / numCoresPerSocket,
    };
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    hardwareInfo.supportedOperatingSystems.operatingSystemFamilyInfo.forEach(
      (osFamily) => {
        osFamily.operatingSystem.forEach((os) => {
          if (os.internalName === osType) {
            computeSectionData.maximumCoresPerSocket = os.maximumCoresPerSocket;
            computeSectionData.maximumCpuCount = os.maximumCpuCount;
            computeSectionData.maximumSocketCount = os.maximumSocketCount;
            computeSectionData.minimumMemoryMegabytes =
              os.minimumMemoryMegabytes;
          }
        });
      },
    );
    return Promise.resolve(computeSectionData);
  }

  async getVmGuestCustomization(
    options,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<VmGuestCustomization> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);
    const data = vm.data;
    const sections: any = {};
    data.section.forEach((section) => {
      if (
        section._type === 'GuestCustomizationSectionType' ||
        section._type === 'VmSpecSectionType'
      ) {
        sections[section._type] = section;
      }
    });
    const guestCustomization = sections.GuestCustomizationSectionType;
    const vmSpec = sections.VmSpecSectionType;
    const osName = vmSpec.osType;
    let osType = null;
    const hardwareInfo = await mainWrapper.user.vdc.getHardwareInfo(
      session,
      props.vdcId,
    );
    hardwareInfo.supportedOperatingSystems.operatingSystemFamilyInfo.forEach(
      (osFamily) => {
        osFamily.operatingSystem.forEach((os) => {
          if (os.internalName === osName) {
            osType = osFamily.name;
          }
        });
      },
    );
    const filteredGuestCustomization = {
      enabled: guestCustomization.enabled,
      changeSid: guestCustomization.changeSid,
      joinDomainEnabled: guestCustomization.joinDomainEnabled,
      useOrgSettings: guestCustomization.useOrgSettings,
      domainName: guestCustomization.domainName,
      domainUserName: guestCustomization.domainUserName,
      domainUserPassword: guestCustomization.domainUserPassword,
      machineObjectOU: guestCustomization.machineObjectOU,
      adminPasswordEnabled: guestCustomization.adminPasswordEnabled,
      adminPasswordAuto: guestCustomization.adminPasswordAuto,
      adminPassword: guestCustomization.adminPassword,
      adminAutoLogonEnabled: guestCustomization.adminAutoLogonEnabled,
      adminAutoLogonCount: guestCustomization.adminAutoLogonCount,
      resetPasswordRequired: guestCustomization.resetPasswordRequired,
      customizationScript: guestCustomization.customizationScript,
      computerName: guestCustomization.computerName,
      osType,
    };
    return Promise.resolve(filteredGuestCustomization);
  }

  async getVmNetworkSection(options, serviceInstanceId, vmId) {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.getVapp(session, vmId);
    const data = vm.data;
    const networkSection = data.section.filter(
      (section) => section._type === 'NetworkConnectionSectionType',
    )[0];
    const networkConnections = networkSection.networkConnection.map(
      (network) => {
        let isPrimary = false;
        if (
          network.networkConnectionIndex ===
          networkSection.primaryNetworkConnectionIndex
        ) {
          isPrimary = true;
        }
        return {
          isPrimary,
          networkConnectionIndex: network.networkConnectionIndex,
          ipAddress: network.ipAddress,
          isConnected: network.isConnected,
          ipAddressAllocationMode: network.ipAddressAllocationMode,
          networkAdapterType: network.networkAdapterType,
          network: network.network,
          needsCustomization: network.needsCustomization,
          macAddress: network.macAddress,
        };
      },
    );
    const filteredNetworkSection = {
      networkConnections,
      primaryNetworkConnectionIndex:
        networkSection.primaryNetworkConnectionIndex,
    };
    return Promise.resolve(filteredNetworkSection);
  }

  async insertMedia(
    options,
    serviceInstanceId: string,
    vAppId: string,
    data,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.insertOrEjectVappMedia(
      session,
      vAppId,
      true,
      data.mediaName,
      data.mediaId,
    );
    await this.loggerService.info(
      'vm',
      'insertMedia',
      {
        _object: action.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async installVmTools(
    options,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vmTools = await mainWrapper.user.vm.installVmTools(session, vmId);
    await this.loggerService.info(
      'vm',
      'installVmTools',
      {
        _object: vmTools.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vmTools.__vcloudTask.split('task/')[1],
    });
  }

  async postAnswer(
    options,
    serviceInstanceId: string,
    vmId: string,
    data,
  ): Promise<void> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    await mainWrapper.user.vm.postAnswer(
      session,
      vmId,
      data.questionId,
      data.choiceId,
    );
    // await this.loggerService.info(
    //   'vm',
    //   'answer',
    //   {
    //     _object: answer.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return;
  }

  async powerOnVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.powerOnVm(session, vAppId);
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async query(
    options,
    serviceInstanceId,
    page,
    pageSize,
    filter,
    type,
    sortDesc,
    sortAsc,
    format,
    fields,
    offset,
    link,
  ): Promise<VmQuery> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      filter,
      page,
      pageSize,
      type,
      format,
      link,
      sortAsc,
      sortDesc,
      fields,
      offset,
    });
    return Promise.resolve(query.data);
  }

  async rebootVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.rebootVm(session, vAppId);
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async removeVmSnapShot(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const snapShot = await mainWrapper.user.vm.removeSnapShot(session, vAppId);
    await this.loggerService.info(
      'vm',
      'deleteSnapshot',
      {
        _object: snapShot.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: snapShot.__vcloudTask.split('task/')[1],
    });
  }

  async resetVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.resetVm(session, vAppId);
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async revertVmSnapShot(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const snapshot = await mainWrapper.user.vm.revertSnapShot(session, vAppId);
    return Promise.resolve({
      taskId: snapshot.__vcloudTask.split('task/')[1],
    });
  }

  async suspendVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.suspendVm(session, vAppId);
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async transferFile(
    options: SessionRequest,
    serviceInstanceId: string,
    transferId: string,
    contentLength: number,
  ): Promise<void> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const fullAddress = `/transfer/${transferId}/file`;
    //   console.log(options.req, transferId, contentLength);
    await this.vmWrapperService.partialUpload(session, fullAddress, options, {
      'Content-Length': contentLength.toString(),
      'Content-Range': `bytes ${0} - ${contentLength} / ${contentLength}`,
      Connection: 'keep-alive',
    });
  }

  async undeployVm(
    options,
    serviceInstanceId: string,
    vAppId: string,
    data,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const action = await mainWrapper.user.vm.undeployVm(
      session,
      vAppId,
      data.action,
    );
    return Promise.resolve({
      taskId: action.__vcloudTask.split('task/')[1],
    });
  }

  async updateVmComputeSection(
    options,
    serviceInstanceId: string,
    vmId: string,
    data,
  ): Promise<TaskReturnDto> {
    //Ali said
    this.paygService.checkAllVdcVmsEvents();

    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const itemTypes = await this.itemTypesTableService.find({
      where: { serviceTypeId: 'vm' },
    });
    for (const itemType of itemTypes) {
      if (
        itemType.code === 'ram' &&
        parseInt(data.memory) > itemType.maxPerRequest
      ) {
        throw new BadRequestException();
      } else if (
        itemType.code === 'cpuCore' &&
        parseInt(data.numCpus) > itemType.maxPerRequest
      ) {
        throw new BadRequestException();
      }
    }
    const vm = await mainWrapper.user.vm.updateVmComputeSection(
      session,
      vmId,
      data.numCpus,
      data.numCoresPerSocket,
      data.memory,
      data.memoryHotAddEnabled,
      data.cpuHotAddEnabled,
      data.nestedHypervisorEnabled,
    );
    await this.loggerService.info(
      'vm',
      'updateComputeSection',
      {
        _object: vm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vm.__vcloudTask.split('task/')[1],
    });
  }

  async updateDiskSection(
    options,
    data,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<TaskReturnDto | ExceedEnoughDiskCountException> {
    this.vmDetailFactoryService.checkPutDiskValidation(data);

    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    // const storageItemType = await this.itemTypesTableService.findOne({
    //   where: {
    //     serviceTypeId: 'vm',
    //     code: 'storage',
    //   },
    // });
    let storageSum = 0;
    data.forEach((disk) => {
      storageSum += parseInt(disk.sizeMb);
    });
    // if (storageSum > storageItemType.maxPerRequest) {
    //   throw new BadRequestException();
    // }
    const vm = await mainWrapper.user.vm.updateVmDiskSection(
      session,
      vmId,
      data,
      props.vdcId,
    );
    await this.loggerService.info(
      'vm',
      'updateDiskSection',
      {
        _object: vm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vm.__vcloudTask.split('task/')[1],
    });
  }

  async updateGuestCustomization(
    options,
    data,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.updateGuestCustomization(
      session,
      vmId,
      data,
    );
    await this.loggerService.info(
      'vm',
      'updateGuestSection',
      {
        _object: vm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vm.__vcloudTask.split('task/')[1],
    });
  }

  async updateMedia(
    options,
    data,
    serviceInstanceId: string,
    mediaId: string,
  ): Promise<TaskReturnDto> {
    if (!data?.name) {
      throw new BadRequestException();
    }
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const media = await mainWrapper.user.vm.updateMedia(
      session,
      mediaId,
      data.name,
    );
    await this.loggerService.info(
      'vm',
      'updateTemplate',
      {
        _object: media.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: media.__vcloudTask.split('task/')[1],
    });
  }

  async updateVAppTemplate(
    options,
    data,
    serviceInstanceId: string,
    templateId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vAppTemplate = await mainWrapper.user.vm.updateVAppTemplate(
      session,
      templateId,
      data.name,
      data.description,
    );
    await this.loggerService.info(
      'vm',
      'updateTemplate',
      {
        _object: vAppTemplate.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vAppTemplate.__vcloudTask.split('task/')[1],
    });
  }

  async updateVmGeneralSection(
    options,
    data,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const vm = await mainWrapper.user.vm.updateVmGeneralSection(
      session,
      vmId,
      data.name,
      data.computerName,
      data.description,
      data.osType,
      data.bootDelay,
      data.enterBIOSSetup,
    );
    await this.loggerService.info(
      'vm',
      'updateGeneralSection',
      {
        _object: vm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vm.__vcloudTask.split('task/')[1],
    });
  }

  async updateVmNetworkSection(
    options,
    data,
    serviceInstanceId: string,
    vmId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    data.networkConnections = data.networkConnections.map((network) => {
      if (network.resetMacAddress) {
        delete network.macAddress;
      }
      return network;
    });
    const vm = await mainWrapper.user.vm.updateNetworkSection(
      session,
      vmId,
      data.networkConnections,
      data.primaryNetworkConnectionIndex,
    );
    await this.loggerService.info(
      'vm',
      'updateNetworkSection',
      {
        _object: vm.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: vm.__vcloudTask.split('task/')[1],
    });
  }

  async uploadFileInfo(
    options: SessionRequest,
    data: UploadFileDto,
    serviceInstanceId: string,
  ): Promise<UploadFileReturnDto> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const check = await this.checkCatalog(session);
    let catalogId = check;
    const org = await this.organizationTableService.findById(props.orgId);
    const vcloudOrgId = org.orgId;
    if (isNil(check)) {
      console.log(vcloudOrgId);
      await createOrgCatalog(session, '', 'user-catalog', vcloudOrgId);
      catalogId = await this.checkCatalog(session);
    }
    const file = await mainWrapper.user.vm.uploadFile(session, catalogId, data);
    const { id: catalogItemId } = file.data.entity;
    const catalogItem = await mainWrapper.user.vm.getMediaItem(
      session,
      catalogItemId.split(':').slice(-1)[0],
    );
    const fullAddress = catalogItem.files.file[0].link[0].href;
    const transferId = fullAddress
      .split('transfer/')[1]
      .split('/upload')[0]
      .replace('/file', '');
    console.log(file.headers);
    return Promise.resolve({
      transferId,
      taskId: catalogItem.tasks.task[0].href.split('task/')[1],
    });
  }

  private async checkCatalog(authToken) {
    const catalogName = 'user-catalog';
    const queryOptions = {
      type: 'catalog',
      page: 1,
      pageSize: 15,
      sortAsc: 'name',
      filter: `name==${catalogName}`,
    };
    const catalogsList = await mainWrapper.user.vdc.vcloudQuery(
      authToken,
      queryOptions,
    );
    let catalogId = null;
    const catalogRecord = catalogsList?.data?.record;
    if (!isNil(catalogRecord) && catalogRecord[0]?.name === catalogName) {
      catalogId = catalogRecord[0].href.split('catalog/')[1];
    }
    return Promise.resolve(catalogId);
  }

  async getCountOfFiles(
    option: SessionRequest,
    serviceInstanceId: string,
  ): Promise<number> {
    const page = 1;
    const pageSize = 1;

    const res = await this.getCatalogMedias(
      option,
      serviceInstanceId,
      page,
      pageSize,
    );
    return res.total;
  }
}
