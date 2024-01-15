import { Injectable } from '@nestjs/common';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { CancelTaskDto } from './dto/cancel-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { GetTaskListDto } from './dto/get-task-list.dto';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

@Injectable()
export class TasksEndpointService {
  name: string;
  constructor() {
    this.name = 'TasksEndpointService';
  }

  cancelTaskEndpoint(options: CancelTaskDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/task/${options.urlParams.taskId}/action/cancel`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }

  getTaskEndpoint(options: GetTaskDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/task/${options.urlParams.taskId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }

  getTaskListEndpoint(options: GetTaskListDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/query`,
      params: {
        type: 'task',
        page: options.params.page,
        pageSize: options.params.pageSize,
        sortDesc: options.params.sortDesc,
      },
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json',
        ...options.headers,
      },
    };
  }
}
