import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetTaskListDto extends EndpointOptionsInterface {
  params: GetTaskListParams;
}

interface GetTaskListParams {
  page: number;
  pageSize: number;
  sortDesc: string;
}
