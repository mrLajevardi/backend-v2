import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SessionsService } from '../../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VdcFactoryService } from './vdc.factory.service';
import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { VdcServiceProperties } from '../enum/vdc-service-properties.enum';
import { VdcItemGroup } from 'src/application/base/invoice/interface/vdc-item-group.interface.dto';
import { AdminVdcWrapperService } from 'src/wrappers/main-wrapper/service/admin/vdc/admin-vdc-wrapper.service';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from 'src/application/base/datacenter/interface/datacenter.interface';
import { TemplatesTableService } from 'src/application/base/crud/templates/templates-table.service';
import {
  TemplatesDto,
  TemplatesStructure,
  templatesQueryParamsDto,
} from '../dto/templates.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { UpdateNamedDiskDto } from '../dto/update-named-disk.dto';
import { CreateNamedDiskDto } from '../dto/create-named-disk.dto';
import { NamedDiskAttachedVms, NamedDiskDto } from '../dto/named-disk.dto';
import { VdcProperties } from '../interface/vdc-properties.interface';
import { ProviderVdcStorageProfilesDto } from 'src/wrappers/main-wrapper/service/user/vdc/dto/provider-vdc-storage-profile.dto';
import { AdminEdgeGatewayWrapperService } from 'src/wrappers/main-wrapper/service/admin/edgeGateway/admin-edge-gateway-wrapper.service';
import {
  ComputeCapacity,
  GetAvailableIps,
  GetAvailableResourcesDto,
  ProviderVdcResourceList,
  StoragePoliciesList,
} from '../dto/get-resources.dto';
import { DiskItemCodes } from 'src/application/base/itemType/enum/item-type-codes.enum';

@Injectable()
export class VdcService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly serviceInstanceTable: ServiceInstancesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly configTable: ConfigsTableService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly vdcWrapperService: VdcWrapperService,
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly datacenterService: BaseDatacenterService,
    private readonly loggerService: LoggerService,
    private readonly adminVdcWrapperService: AdminVdcWrapperService,
    private readonly templatesTableService: TemplatesTableService,
    private readonly adminEdgeGatewayWrapperService: AdminEdgeGatewayWrapperService,
  ) {}

  async createVdc(
    userId: number,
    orgId: number,
    vcloudOrgId: string,
    orgName: string,
    data: VdcItemGroup,
    serviceInstanceId: string,
  ) {
    const sessionToken = await this.sessionService.checkAdminSession();
    console.log('session checked and created');
    const service = await this.serviceInstanceTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    const vdcExist = await this.checkVdcExistence(
      userId,
      orgId,
      serviceInstanceId,
    );
    console.log('vdc exists', vdcExist);
    if (service.status == 2 || vdcExist !== null) {
      // service is broken
      const repair = await this.repairVdc(userId, orgId, serviceInstanceId);
      if (repair.isOk) {
        return Promise.resolve({
          id: repair['vdcId'],
          name: repair['name'],
          __vcloudTask: null,
        });
      }
      const vdcNameProperty = await this.servicePropertiesTable.findOne({
        where: {
          serviceInstanceId,
          propertyKey: 'name',
        },
      });
      // uses current vdc name
      const vdcName = vdcNameProperty.value;
      return this.initVdc(
        data,
        sessionToken,
        vdcName,
        vcloudOrgId,
        orgId,
        serviceInstanceId,
      );
    }
    console.log('create new vdc');
    // creates a new vdc name
    const vdcName = orgName + '_vdc_' + service.index;
    console.log(vdcName, '🍔');
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'name',
      value: vdcName,
    });
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'orgId',
      value: orgId.toString(),
    });
    return this.initVdc(
      data,
      sessionToken,
      vdcName,
      vcloudOrgId,
      orgId,
      serviceInstanceId,
    );
  }
  /**
   * @param {Object} app
   * @param {String} userId
   * @param {String} orgId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async repairVdc(userId, orgId, serviceInstanceId) {
    const checkVdc = await this.checkVdcExistence(
      userId,
      orgId,
      serviceInstanceId,
    );
    if (checkVdc) {
      // vdc has been created in cloud
      const vdcIdProperty = await this.servicePropertiesTable.findOne({
        where: {
          serviceInstanceId,
          propertyKey: 'vdcId',
        },
      });
      const vdcId = checkVdc.href.split('/').slice(-1)[0];
      const urnVdcId = `urn:vcloud:vdc:${vdcId}`;
      if (vdcIdProperty !== null) {
        // vdc has been created in cloud and its saved in db
        return {
          isOk: true,
          data: checkVdc,
        };
      }
      // vdc has been created in cloud and its not saved in db
      return {
        isOk: true,
        data: {
          name: checkVdc.name,
          vdcId: urnVdcId,
        },
      };
    }
    // needs to be created again
    return {
      isOk: false,
      data: null,
    };
  }

  async checkVdcExistence(userId, orgId, serviceInstanceId) {
    const vdcNameProperty = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: serviceInstanceId,
        propertyKey: 'name',
      },
    });
    const vdcName = vdcNameProperty?.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'orgVdc',
      filter: `name==${vdcName}`,
    });
    if (query.data.record.length > 0) {
      return query.data.record[0];
    }
    return null;
  }
  /**
   * @param {Object} app
   * @param {Object} data
   * @param {String} sessionToken
   * @param {String} vdcName
   * @param {String} vcloudOrgId
   * @param {String} orgId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async initVdc(
    data: VdcItemGroup,
    sessionToken: string,
    vdcName: string,
    vcloudOrgId: string,
    orgId: number,
    serviceInstanceId: string,
  ) {
    console.log('init vdc');
    const datacenterGenId = await this.servicePropertiesTable.getValueBy(
      serviceInstanceId,
      VdcServiceProperties.GenerationId,
    );
    const datacenterMetadata =
      await this.datacenterService.getDatacenterMetadata('', datacenterGenId);
    const networkQuota = await this.configTable.findOne({
      where: {
        propertyKey: 'networkQuota',
        serviceTypeId: 'vdc',
      },
    });
    console.log('create vdc with wrapper with data: ', data);
    const providerVdcReferenceHref =
      process.env.VCLOUD_BASE_URL +
      '/api/admin/providervdc/' +
      datacenterGenId.split(':').slice(-1)[0];
    const vdcStorageProfiles = await this.vdcFactoryService.getStorageProfiles(
      sessionToken,
      data.generation.disk,
      datacenterGenId.split(':').slice(-1)[0],
    );
    const vdcInfo = await this.adminVdcWrapperService.createVdc(
      {
        providerVdcReference: {
          href: providerVdcReferenceHref,
        },
        vdcStorageProfiles,
        networkPoolReference: vcdConfig.admin.vdc.NetworkPoolReference,
        resourceGuaranteedMemory: Number(data.memoryReservation.value) / 100,
        resourceGuaranteedCpu: Number(data.cpuReservation.value) / 100,
        cores: Number(data.generation.cpu[0].value),
        vCpuInMhz: Number(datacenterMetadata.cpuSpeed),
        ram: Number(data.generation.ram[0].value),
        storage: data['storage'],
        authToken: sessionToken,
        name: vdcName,
        vm: Number(data.generation.vm[0].value),
        networkQuota: Number(networkQuota.value),
        isEnabled: true,
      },
      vcloudOrgId,
    );
    const props = [{ key: 'vdcId', value: vdcInfo.id }];
    props.forEach(async (prop) => {
      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: prop.key,
        value: prop.value,
      });
    });
    return Promise.resolve({
      id: vdcInfo.id,
      name: vdcName,
      executionTime: 0,
      __vcloudTask: vdcInfo.__vcloudTask,
    });
  }

  /**
   * @param {Object} app
   * @param {String} userId
   * @param {String} orgId
   * @param {String} vdcId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async deleteVdc(userId, orgId, vdcId, serviceInstanceId) {
    const sessionToken = await this.sessionService.checkAdminSession();

    const deleteVdc = await mainWrapper.admin.vdc.deleteVdc(
      sessionToken,
      vdcId,
    );
    return Promise.resolve({
      __vcloudTask: deleteVdc.headers['location'],
    });
  }

  async attachNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
    nameDiskID: string,
    vmID: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const namedDisk = await this.vdcWrapperService.attachNamedDisk(
      session,
      nameDiskID,
      vmID,
    );
    return {
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    };
  }
  async createNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
    data: CreateNamedDiskDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const { busType } = data;
    if (busType != 20) {
      throw new BadRequestException();
    }
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await this.vdcWrapperService.createNamedDisk(
      session,
      props['vdcId'],
      data,
    );
    const taskId = await mainWrapper.user.vdc.vcloudQuery(session, {
      page: 1,
      pageSize: 10,
      filter: 'object==' + namedDisk.__vcloudTask,
      type: 'task',
    });
    return {
      taskId: taskId.data.record[0].href.split('task/')[1],
    };
  }

  async detachNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
    nameDiskID: string,
    vmID: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await this.vdcWrapperService.detachNamedDisk(
      session,
      nameDiskID,
      vmID,
    );
    return {
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    };
  }
  async getNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
  ): Promise<NamedDiskDto[]> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const recordList = await this.vdcWrapperService.getNamedDisk(
      session,
      props['vdcId'],
    );
    const recordListForFront: NamedDiskDto[] = [];
    for (const element of recordList) {
      const id = element.href.split('disk/')[1];
      const name = element.name;
      const sizeMb = element.sizeMb;
      const description = element.description;
      const isAttached = element.isAttached;
      const ownerName = element.ownerName;
      const status = element.status;
      const attachedVmCount = element.attachedVmCount;
      let attachedVms: NamedDiskAttachedVms[] = [];
      if (attachedVmCount > 0) {
        const attachedVmList =
          await this.vdcWrapperService.getVmAttachedNamedDisk(session, id);
        attachedVms = attachedVmList.data.vmReference.map((vm) => {
          return {
            name: vm.name,
            id: vm.href.split('/').slice(-1)[0],
          };
        });
      }
      recordListForFront.push({
        id,
        name,
        sizeMb,
        description,
        isAttached,
        ownerName,
        status,
        attachedVmCount,
        attachedVms,
        busType: element.busType,
        busSubType: element.busSubType,
        sharingType: element.sharingType,
        busTypeDesc: element.busTypeDesc,
        policyId: element.storageProfile.split('/').slice(-1)[0],
      });
    }
    return recordListForFront;
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async getVdc(
    options: SessionRequest,
    vdcInstanceId,
  ): Promise<GetOrgVdcResult> {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const vdcData = await this.vdcWrapperService.vcloudQuery<any>(session, {
      type: 'orgVdc',
      format: 'records',
      page: 1,
      pageSize: 10,
      filter: `id==${props['vdcId']}`,
    });
    if (vdcData.data.total === 0) {
      // There is no any vdc in vcloud for this vdc Id ==>props['vdcId']
      return null;
    }
    const model = this.vdcFactoryService.getVdcOrgVdcModelResult(vdcData);

    return Promise.resolve(model);
  }

  async getVmAttachedToNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
    nameDiskID: string,
  ): Promise<string> {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const vmData = await this.vdcWrapperService.getVmAttachedNamedDisk(
      session,
      nameDiskID,
    );

    if (vmData.data) {
      return vmData.data.vmReference[0].href.split('vApp/')[1];
    }
    return null;
  }

  async removeNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
    nameDiskID: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await this.vdcWrapperService.removeNamedDisk(
      session,
      nameDiskID,
    );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  }

  async updateNamedDisk(
    options: SessionRequest,
    vdcInstanceId: string,
    nameDiskID: string,
    data: UpdateNamedDiskDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const { busType } = data;
    if (busType != 20) {
      return Promise.reject(new BadRequestException());
    }
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.updateNamedDisk(
      session,
      props['vdcId'],
      nameDiskID,
      data,
    );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  }

  async getTemplates(query: templatesQueryParamsDto): Promise<TemplatesDto[]> {
    const serviceTypeId = 'vdc';
    const templates = await this.templatesTableService.find({
      where: {
        servicePlanType: query.servicePlanType,
        serviceType: { id: serviceTypeId },
        // datacenterName: query.datacenterName,
        enabled: true,
      },
    });
    const templatesList: TemplatesDto[] = [];
    for (const template of templates) {
      const { structure } = template;
      console.log(structure);
      const parsedStructure: TemplatesStructure = JSON.parse(structure);
      const templateDto: TemplatesDto = {
        guid: template.guid,
        ...parsedStructure,
        isDefault: template.isDefault,
        name: template.name,
        description: template.description,
        servicePlanType: template.servicePlanType,
      };
      templatesList.push(templateDto);
    }
    return templatesList;
  }

  async getAvailableResources(
    datacenterName: string,
  ): Promise<GetAvailableResourcesDto> {
    const adminSession = await this.sessionService.checkAdminSession();
    const externalNetworks =
      await this.adminEdgeGatewayWrapperService.findExternalNetwork(
        adminSession,
        1,
        1,
      );
    const availableIps: GetAvailableIps = {
      totalIpCount: 0,
      usedIpCount: 0,
    };
    externalNetworks.values[0].subnets.values.forEach((value) => {
      availableIps.totalIpCount += value.totalIpCount;
      availableIps.usedIpCount += value.usedIpCount;
    });

    const datacenter =
      await this.datacenterService.getDatacenterConfigWithGen();
    const targetDatacenter = datacenter.find(
      (item) => item.datacenter === datacenterName,
    );
    const providerVdcList: ProviderVdcResourceList[] = [];
    for (const gen of targetDatacenter.gens) {
      const providerVdc: ProviderVdcResourceList = {
        ...gen,
      } as ProviderVdcResourceList;
      const storageProfiles =
        await this.vdcWrapperService.vcloudQuery<ProviderVdcStorageProfilesDto>(
          adminSession,
          {
            type: 'providerVdcStorageProfile',
            format: 'records',
            page: 1,
            pageSize: 15,
            sortAsc: 'name',
            filter: `isEnabled==true;providerVdc==${
              gen.id.split(':').slice(-1)[0]
            }`,
          },
        );
      const filteredStorageProfiles: StoragePoliciesList[] = [];
      for (const profile of storageProfiles.data.record) {
        const name = Object.values(DiskItemCodes).find((code) =>
          profile.name.toLocaleLowerCase().includes(code),
        );
        if (!name) {
          
          continue;
        }
        const data: StoragePoliciesList = {
          name,
          storageTotalMB: profile.storageTotalMB,
          storageUsedMB: profile.storageUsedMB,
        };
        filteredStorageProfiles.push(data);
      }
      providerVdc.storagePolicies = filteredStorageProfiles;
      const computePolicies = await this.adminVdcWrapperService.getProviderVdc(
        adminSession,
        gen.id,
      );
      const metadata = await this.datacenterService.getDatacenterMetadata(
        '',
        gen.id,
      );
      const filteredComputePolicies: ComputeCapacity = {
        cpu: {
          allocation: computePolicies.computeCapacity.cpu.allocation,
          reserved: computePolicies.computeCapacity.cpu.reserved,
          total: computePolicies.computeCapacity.cpu.total,
          used: computePolicies.computeCapacity.cpu.used,
          cpuSpeed: metadata.cpuSpeed as number,
        },
        ram: {
          allocation: computePolicies.computeCapacity.memory.allocation,
          reserved: computePolicies.computeCapacity.memory.reserved,
          total: computePolicies.computeCapacity.memory.total,
          used: computePolicies.computeCapacity.memory.used,
        },
      };
      providerVdc.computeCapacity = filteredComputePolicies;
      providerVdcList.push(providerVdc);
    }
    return {
      providerGateway: availableIps,
      providerVdc: providerVdcList,
    };
  }
}
