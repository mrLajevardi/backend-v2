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

@Injectable()
export class VmDetailService {
  constructor(
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionsServices: SessionsService,
    private readonly vdcWrapperService: VdcWrapperService,
    private readonly vmWrapperService: VmWrapperService,
    private readonly vmDetailFactoryService: VmDetailFactoryService,
  ) {}

  async TasksVm(
    options: SessionRequest,
    serviceInstanceId: string,
    vappId: string,
    vmId: string,
    filter: string,
    search: string,
  ): Promise<VmTasksDto[]> {
    // TODO ==> Implementation  Filter and Search

    const userId = options.user.userId;
    vappId = 'vapp-365e2e3e-503b-4f46-aa45-1a6ddd4ee584';

    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );
    const session = await this.sessionsServices.checkUserSession(
      userId,
      props.orgId,
    );
    if (filter !== '') {
      // filter = `(isVAppTemplate==false;vdc==${props.vdcId});` + `(${filter})`;
      // ((object==https://labvpc.aradcloud.com/api/vApp/vm-8fd59628-64f9-439c-8e92-6d01ca2bbbe2,object==https://labvpc.aradcloud.com/api/vApp/vapp-365e2e3e-503b-4f46-aa45-1a6ddd4ee584))
      // filter = `(object==https://labvpc.aradcloud.com/api/vApp/${vmId})`;
      filter = `(object==${process.env.VCLOUD_BASE_URL}/api/vApp/${vmId},object==${process.env.VCLOUD_BASE_URL}/api/vApp/${vappId})`;
    }
    // else {
    //   filter = `(isVAppTemplate==false;vdc==${props.vdcId})`;
    // }
    // if (search) {
    //   filter = filter + `;(name==*${search}*,guestOs==*${search}*)`;
    //  }

    const tasks = await this.vdcWrapperService.vcloudQuery(session, {
      type: TaskQueryTypes.Task,
      format: 'records',
      page: 1,
      pageSize: 128,
      filterEncoded: true,
      links: true,
      filter: filter,
      sortDesc: 'startDate',
    });
    const tasksModels: VmTaskModel = JSON.parse(JSON.stringify(tasks.data));

    const taskValues: VmTasksDto[] = [];

    tasksModels.record.forEach((task) => {
      taskValues.push({
        type: task._type, // ?
        compilationDate: new Date(task.endDate),
        functor: task.ownerName, // ?
        status: task.status, // ?
        createDate: new Date(task.startDate),
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
    const filterDate =
      this.vmDetailFactoryService.filterTimeStampVmDetails(query);

    // query.vappId = 'vapp-365e2e3e-503b-4f46-aa45-1a6ddd4ee584';
    const userId = options.user.userId;
    const vmguid = query.vmId.replace('vm-', '');
    const vappguid = query.vappId.replace('vapp-', '');
    // https://labvpc.aradcloud.com/cloudapi/1.0.0/auditTrail?page=1&pageSize=15&filterEncoded=true&filter=(timestamp=gt=2023-10-31T20:30:00.071Z)&sortDesc=timestamp&links=true
    //(timestamp=gt=2023-10-31T20:30:00.602Z;(eventEntity.id==urn:vcloud:vm:8fd59628-64f9-439c-8e92-6d01ca2bbbe2,eventEntity.id==urn:vcloud:vapp:365e2e3e-503b-4f46-aa45-1a6ddd4ee584))
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
    // if (filter !== '') {
    //   // filter = `(isVAppTemplate==false;vdc==${props.vdcId});` + `(${filter})`;
    //   // ((object==https://labvpc.aradcloud.com/api/vApp/vm-8fd59628-64f9-439c-8e92-6d01ca2bbbe2,object==https://labvpc.aradcloud.com/api/vApp/vapp-365e2e3e-503b-4f46-aa45-1a6ddd4ee584))
    //   // filter = `(object==https://labvpc.aradcloud.com/api/vApp/${vmId})`;
    //   filter = `(object==${process.env.VCLOUD_BASE_URL}/api/vApp/${vmId},object==${process.env.VCLOUD_BASE_URL}/api/vApp/${vappId})`;
    // }
    // else {
    //   filter = `(isVAppTemplate==false;vdc==${props.vdcId})`;
    // }
    // if (search) {
    //   filter = filter + `;(name==*${search}*,guestOs==*${search}*)`;
    //  }

    const tasks = await this.vmWrapperService.eventVm(
      session,
      filter,
      query.page,
      query.pageSize,
    );
    res.totalNumber = tasks.data.resultTotal;
    res.pageSize = tasks.data.pageSize;
    res.pageNumber = tasks.data.page;
    res.pageCountTotal = tasks.data.pageCount;
    res.totalNumber = tasks.data.resultTotal;
    tasks.data.values.forEach((event) => {
      res.values.push({
        type: (event.eventType as string).split('/')[5],
        date: event.timestamp,
        status: event.eventStatus == 'SUCCESS',
        performingUser: event.user.name,
      });
    });
    return Promise.resolve(res);
    // const tasksModels: VmTaskModel = JSON.parse(JSON.stringify(tasks.data));
    //
    // const taskValues: VmTasksDto[] = [];
  }
}
