import { Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { ServiceInstances } from '../../../infrastructure/database/entities/ServiceInstances';
import { isNil } from 'lodash';
import { NotFoundDataException } from '../../../infrastructure/exceptions/not-found-data.exception';
import { PermissionDeniedException } from '../../../infrastructure/exceptions/permission-denied.exception';
import { VdcProperties } from '../../vdc/interface/vdc-properties.interface';
import { ServiceInstancesTableService } from '../../base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { EdgeGatewayWrapperService } from '../../../wrappers/main-wrapper/service/user/edgeGateway/edge-gateway-wrapper.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { IpSecVpnWrapperService } from '../../../wrappers/main-wrapper/service/user/ipSecVpn/ip-sec-vpn-wrapper.service';
import { BaseFactoryException } from '../../../infrastructure/exceptions/base/base-factory.exception';
import { TaskReturnDto } from '../../../infrastructure/dto/task-return.dto';
import { CreateIpSecVpnWrapperDto } from '../../../wrappers/main-wrapper/service/user/ipSecVpn/dto/create-ip-sec-vpn-wrapper.dto';
import { CreateIpSecVpnVdcDto } from '../dto/create-ip-sec-vpn-vdc.dto';
import { UpdateIpSecVpnWrapperDto } from '../../../wrappers/main-wrapper/service/user/ipSecVpn/dto/update-ip-sec-vpn-wrapper.dto';
import { UpdateIpSecVpnVdcDto } from '../dto/update-ip-sec-vpn-vdc.dto';
import { UpdateIpSecVpnConnectionPropertyWrapperDto } from '../../../wrappers/main-wrapper/service/user/ipSecVpn/dto/update-ip-sec-vpn-connection-property-wrapper.dto';
import { UpdateIpSecVpnConnectionPropertyVdcDto } from '../dto/update-ip-sec-vpn-connection-property-vdc.dto';
import { PatchIpSecVpnVdcDto } from '../dto/patch-ip-sec-vpn-vdc.dto';
import {
  IpSecVpnResultDto,
  IpSecVpnResultType,
} from '../dto/result/ip-sec-vpn.result.dto';
import { IpSecVpnAuthModeEnum } from '../enum/ip-sec-vpn-auth-mode.enum';

@Injectable()
export class IpSecVpnService {
  constructor(
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
    private readonly sessionService: SessionsService,
    private readonly ipSecVpnWrapperService: IpSecVpnWrapperService,
    private readonly baseFactoryException: BaseFactoryException,
  ) {}

  async getEdgeIdByServiceInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
  ): Promise<string> {
    const serviceInstance: ServiceInstances =
      await this.serviceInstancesTableService.findById(serviceInstanceId);

    if (isNil(serviceInstance)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    if (serviceInstance.userId != options.user.userId) {
      this.baseFactoryException.handle(PermissionDeniedException);
    }

    const serviceProperties =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );

    if (isNil(serviceProperties.edgeName) || isNil(serviceProperties.orgId)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const filter = `name==${serviceProperties.edgeName}`;

    const currentGateway = await this.edgeGatewayWrapperService.getEdgeGateway(
      session,
      1,
      100,
      filter,
    );

    const result = currentGateway.values[0];

    return result.id;
  }

  async getSession(userId: number, serviceInstanceId: string): Promise<string> {
    const serviceProperties =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        serviceInstanceId,
      );

    return await this.sessionService.checkUserSession(
      userId,
      Number(serviceProperties.orgId),
    );
  }

  async createIpSecVpnByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    data: CreateIpSecVpnVdcDto,
  ): Promise<TaskReturnDto> {
    const edgeId = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );

    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const createIpSecVpnWrapperDto: CreateIpSecVpnWrapperDto = {
      gatewayId: edgeId,
      name: data.name,
      description: data.description ?? null,
      authenticationMode: data.authenticationMode,
      active: data.active,
      preSharedKey: data.preSharedKey,
      localEndpoint: data.localEndpoint,
      remoteEndpoint: data.remoteEndpoint,
      securityType: data.securityType,
      logging: false,
    };

    const ipSecVpn = await this.ipSecVpnWrapperService.create(
      session,
      createIpSecVpnWrapperDto,
    );

    return Promise.resolve({
      taskId: ipSecVpn.__vcloudTask.split('task/')[1],
    });
  }

  async getIpSecVpnByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const data = await this.ipSecVpnWrapperService.get(session, edgeId);

    return data?.data ?? null;
  }

  async findIpSecVpnByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const data = await this.ipSecVpnWrapperService.find(
      session,
      edgeId,
      ipSecVpnId,
    );

    return data.data ?? null;
  }

  async updateIpSecVpnByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
    dto: UpdateIpSecVpnVdcDto,
  ): Promise<TaskReturnDto> {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const data = await this.ipSecVpnWrapperService.find(
      session,
      edgeId,
      ipSecVpnId,
    );

    if (isNil(data.data?.id)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const updateIpSecVpnWrapperDto: UpdateIpSecVpnWrapperDto = {
      ipSecVpnId: ipSecVpnId,
      gatewayId: edgeId,
      name: dto.name,
      active: dto.active,
      authenticationMode: dto.authenticationMode,
      description: dto.description,
      localEndpoint: dto.localEndpoint,
      remoteEndpoint: dto.remoteEndpoint,
      securityType: dto.securityType,
      logging: false,
      preSharedKey: dto.preSharedKey,
    };

    const ipSecVpn = await this.ipSecVpnWrapperService.update(
      session,
      updateIpSecVpnWrapperDto,
    );

    return Promise.resolve({
      taskId: ipSecVpn.__vcloudTask.split('task/')[1],
    });
  }

  async pathIpSecVpnByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
    dto: PatchIpSecVpnVdcDto,
  ): Promise<TaskReturnDto> {
    const ipSecVpn = await this.findIpSecVpnByVdcInstanceId(
      options,
      serviceInstanceId,
      ipSecVpnId,
    );
    const result: IpSecVpnResultType = new IpSecVpnResultDto().toArray(
      ipSecVpn,
    );
    const updateIpSecVpnDto: UpdateIpSecVpnVdcDto = {
      name: dto.name ?? result.name,
      description: dto.description ?? result.description,
      active: dto.active ?? result.active,
      preSharedKey: dto.preSharedKey ?? result.preSharedKey,
      authenticationMode:
        IpSecVpnAuthModeEnum[
          dto.authenticationMode ?? result.authenticationMode
        ],
      securityType: dto.securityType ?? result.securityType,
      localEndpoint: {
        localId: dto.localEndpoint?.localId ?? result.localEndpoint.localId,
        localAddress:
          dto.localEndpoint?.localAddress ?? result.localEndpoint.localAddress,
        localNetworks:
          dto.localEndpoint?.localNetworks ??
          result.localEndpoint.localNetworks,
      },
      remoteEndpoint: {
        remoteId:
          dto.remoteEndpoint?.remoteId ?? result.remoteEndpoint.remoteId,
        remoteAddress:
          dto.remoteEndpoint?.remoteAddress ??
          result.remoteEndpoint.remoteAddress,
        remoteNetworks:
          dto.remoteEndpoint?.remoteNetworks ??
          result.remoteEndpoint.remoteNetworks,
      },
    };

    return await this.updateIpSecVpnByVdcInstanceId(
      options,
      serviceInstanceId,
      ipSecVpnId,
      updateIpSecVpnDto,
    );
  }

  async deleteIpSecVpnByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
  ): Promise<TaskReturnDto> {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const ipSecVpn = await this.ipSecVpnWrapperService.delete(
      session,
      edgeId,
      ipSecVpnId,
    );

    return Promise.resolve({
      taskId: ipSecVpn.__vcloudTask.split('task/')[1],
    });
  }

  async getDefaultConnectionProperty(
    options: SessionRequest,
    serviceInstanceId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const data = await this.ipSecVpnWrapperService.getDefaultConnectionProperty(
      session,
      edgeId,
    );

    return data?.data ?? null;
  }

  async getIpSecVpnConnectionProperty(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const findIpSecVpn = await this.ipSecVpnWrapperService.find(
      session,
      edgeId,
      ipSecVpnId,
    );

    if (isNil(findIpSecVpn.data?.id)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const data =
      await this.ipSecVpnWrapperService.getIpSecVpnConnectionProperty(
        session,
        edgeId,
        ipSecVpnId,
      );

    return data?.data ?? null;
  }

  async getIpSecVpnStatus(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const findIpSecVpn = await this.ipSecVpnWrapperService.find(
      session,
      edgeId,
      ipSecVpnId,
    );

    if (isNil(findIpSecVpn.data?.id)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const data = await this.ipSecVpnWrapperService.getIpSecVpnStatus(
      session,
      edgeId,
      ipSecVpnId,
    );

    return data?.data ?? null;
  }

  async getIpSecVpnStatistics(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const findIpSecVpn = await this.ipSecVpnWrapperService.find(
      session,
      edgeId,
      ipSecVpnId,
    );

    if (isNil(findIpSecVpn.data?.id)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const data = await this.ipSecVpnWrapperService.getIpSecVpnStatistics(
      session,
      edgeId,
      ipSecVpnId,
    );

    return data?.data ?? null;
  }

  async updateIpSecVpnConnectionProperty(
    options: SessionRequest,
    serviceInstanceId: string,
    ipSecVpnId: string,
    dto: UpdateIpSecVpnConnectionPropertyVdcDto,
  ): Promise<TaskReturnDto> {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const findIpSecVpn = await this.ipSecVpnWrapperService.find(
      session,
      edgeId,
      ipSecVpnId,
    );

    if (isNil(findIpSecVpn.data?.id)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }
    const updatingConnectionPropertyDto: UpdateIpSecVpnConnectionPropertyWrapperDto =
      {
        ipSecVpnId: ipSecVpnId,
        ikeConfiguration: dto.ikeConfiguration,
        tunnelConfiguration: dto.tunnelConfiguration,
        dpdProbeInterval: dto.dpdProbeInterval,
        gatewayId: edgeId,
        securityType: dto.securityType,
      };

    const updatingConnectionProperty =
      await this.ipSecVpnWrapperService.updateConnectionProperty(
        session,
        edgeId,
        ipSecVpnId,
        updatingConnectionPropertyDto,
      );

    return Promise.resolve({
      taskId: updatingConnectionProperty.__vcloudTask.split('task/')[1],
    });
  }
}
