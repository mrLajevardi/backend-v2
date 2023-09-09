import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CancelTaskDto extends EndpointOptionsInterface {
  urlParams: CancelTaskUrlParams;
}

interface CancelTaskUrlParams {
  taskId: string;
}
