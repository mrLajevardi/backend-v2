import { Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { ServiceInstancesTableService } from '../../base/crud/service-instances-table/service-instances-table.service';
import { ServiceInstances } from '../../../infrastructure/database/entities/ServiceInstances';
import { BaseFactoryException } from '../../../infrastructure/exceptions/base/base-factory.exception';
import { PermissionDeniedException } from '../../../infrastructure/exceptions/permission-denied.exception';
import { isNil } from 'lodash';
import { NotFoundDataException } from '../../../infrastructure/exceptions/not-found-data.exception';
import { ServicePropertiesTableService } from '../../base/crud/service-properties-table/service-properties-table.service';
import { ServiceProperties } from '../../../infrastructure/database/entities/ServiceProperties';
import { EdgeGatewayWrapperService } from '../../../wrappers/main-wrapper/service/user/edgeGateway/edge-gateway-wrapper.service';
import { VdcProperties } from '../../vdc/interface/vdc-properties.interface';
import { SessionsService } from '../../base/sessions/sessions.service';
import { StaticRouteWrapperService } from '../../../wrappers/main-wrapper/service/user/staticRoute/static-route-wrapper.service';
import { CreateStaticRouteDto } from '../../../wrappers/main-wrapper/service/user/staticRoute/dto/create-static-route.dto';
import { TaskReturnDto } from '../../../infrastructure/dto/task-return.dto';
import { CreateStaticRouteVdc } from '../dto/create-static-route-vdc';
import { StaticRouteResultDto } from '../dto/result/static-route.result.dto';

@Injectable()
export class StaticRouteService {
  constructor(
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly baseFactoryException: BaseFactoryException,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
    private readonly sessionService: SessionsService,
    private readonly staticRouteWrapperService: StaticRouteWrapperService,
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

  async createStaticRouteByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    data: CreateStaticRouteVdc,
  ): Promise<TaskReturnDto> {
    const edgeId = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );

    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const createStaticRouteDto: CreateStaticRouteDto = {
      name: data.name,
      networkCidr: data.networkCidr,
      description: data.description ?? null,
      gatewayId: edgeId,
      systemOwned: false,
      nextHops: data.nextHops,
    };

    const staticRoute = await this.staticRouteWrapperService.create(
      session,
      createStaticRouteDto,
    );

    return Promise.resolve({
      taskId: staticRoute.__vcloudTask.split('task/')[1],
    });
  }

  async getStaticRouteByVdcInstanceId(
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

    const data = await this.staticRouteWrapperService.get(session, edgeId);

    return new StaticRouteResultDto().collection(data.data);
  }

  async findStaticRouteByVdcInstanceId(
    options: SessionRequest,
    serviceInstanceId: string,
    routeId: string,
  ) {
    const edgeId: string = await this.getEdgeIdByServiceInstanceId(
      options,
      serviceInstanceId,
    );
    const session: string = await this.getSession(
      options.user.userId,
      serviceInstanceId,
    );

    const data = await this.staticRouteWrapperService.find(
      session,
      edgeId,
      routeId,
    );

    return new StaticRouteResultDto().toArray(data.data);
  }
}
