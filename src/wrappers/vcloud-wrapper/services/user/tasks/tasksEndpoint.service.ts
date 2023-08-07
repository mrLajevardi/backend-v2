import { Injectable } from '@nestjs/common';
import {
  EndpointInterface,
  EndpointOptionsInterface,
} from 'src/wrappers/interfaces/endpoint.interface';

@Injectable()
export class TasksEndpointService {
  cancelTaskEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'post',
      resource: `/api/task/${options.urlParams.taskId}/action/cancel`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }

  getTaskEndpoint(options: EndpointOptionsInterface): EndpointInterface {
    return {
      method: 'get',
      resource: `/api/task/${options.urlParams.taskId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }

  getTaskListEndpoint(options: EndpointOptionsInterface): EndpointInterface {
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
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json',
        ...options.headers,
      },
    };
  }
}
