import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetTaskDto extends EndpointOptionsInterface {
  urlParams: GetTaskUrlParams;
}

interface GetTaskUrlParams {
  taskId: string;
}
