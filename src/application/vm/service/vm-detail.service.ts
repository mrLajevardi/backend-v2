import { Injectable } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { ServicePropertiesService } from '../../base/service-properties/service-properties.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { VmTask, VmTaskModel, VmTasksDto } from '../dto/vm-tasks.dto';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { TaskQueryTypes } from '../../base/tasks/enum/task-query-types.enum';
import * as process from 'process';
import { VmWrapperService } from '../../../wrappers/main-wrapper/service/user/vm/vm-wrapper.service';
import { VmEventQueryDto } from '../dto/vm-event.query.dto';
import { VmEventResultDto } from '../dto/vm-event.result.dto';
import * as events from 'events';
import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';
import { timestamp } from 'rxjs';
import { VmDetailFactoryService } from './vm-detail.factory.service';
import { formatVcloudDate } from '../../../infrastructure/utils/extensions/date.extension';
import { VmTasksQueryDto } from '../dto/vm-tasks.query.dto';

@Injectable()
export class VmDetailService {
  constructor(
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionsServices: SessionsService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly vmWrapperService: VmWrapperService,
    private readonly vmDetailFactoryService: VmDetailFactoryService,
  ) {}

  async tasksVm(
    options: SessionRequest,
    query: VmTasksQueryDto,
  ): Promise<VmTasksDto[]> {
    // TODO ==> Implementation  Filter and Search

    const userId = options.user.userId;
    let filter = '';
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        query.serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    const filterDate: string = this.vmDetailFactoryService.filterDateVmDetails(
      query.dateBegin,
      query.dateEnd,
      query.dateFilter,
      'startDate',
    );
    filter = `(object==${process.env.VCLOUD_BASE_URL}/api/vApp/${query.vmId},object==${process.env.VCLOUD_BASE_URL}/api/vApp/${query.vappId});${filterDate}`;

    const tasks = await this.vdcWrapperService.vcloudQuery(session, {
      type: TaskQueryTypes.Task,
      format: 'records',
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      filterEncoded: true,
      links: true,
      filter: filter,
      sortDesc: 'startDate',
    });
    const tasksModels: VmTaskModel = JSON.parse(JSON.stringify(tasks.data));

    const taskValues: VmTasksDto[] = [];

    tasksModels.record.forEach((task) => {
      taskValues.push({
        type: task.objectType, // ?
        compilationDate: task.endDate,
        performingUser: task.ownerName, // ?
        status: task.status.trim().toLowerCase() == 'success' ? 1 : 0, // ?
        createDate: task.startDate,
      });
    });

    return taskValues;
  }

  async eventVm(
    options: SessionRequest,
    query: VmEventQueryDto,
  ): Promise<VmEventResultDto> {
    const res: VmEventResultDto = {
      values: [],
      totalNumber: 0,
      pageNumber: 1,
      pageSize: 20,
      pageCountTotal: 0,
    };
    const filterDate = this.vmDetailFactoryService.filterDateVmDetails(
      query.dateBegin,
      query.dateEnd,
      query.dateFilter,
      'timestamp',
    );

    // query.vappId = 'vapp-365e2e3e-503b-4f46-aa45-1a6ddd4ee584';
    const userId = options.user.userId;
    const vmguid = query.vmId.replace('vm-', '');
    const vappguid = query.vappId.replace('vapp-', '');
    //TODO --> Time Stamp Expression (امروز - این هفته - این ماه )
    const filter = `(${filterDate}(eventEntity.id==urn:vcloud:vm:${vmguid},eventEntity.id==urn:vcloud:vapp:${vappguid}))`;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        query.serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );

    const events = await this.vmWrapperService.eventVm(
      session,
      filter,
      query.page,
      query.pageSize,
    );
    res.totalNumber = events.data.resultTotal;
    res.pageSize = events.data.pageSize;
    res.pageNumber = events.data.page;
    res.pageCountTotal = events.data.pageCount;
    res.totalNumber = events.data.resultTotal;
    events.data.values.forEach((event) => {
      res.values.push({
        // type: (event.eventType as string).split('/')[5],
        date: event.timestamp,
        status: event.eventStatus == 'SUCCESS',
        performingUser: event.user.name,
        description: event.description,
        operationType: event.eventType,
      });
    });
    return Promise.resolve(res);
  }
}
