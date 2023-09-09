import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface QuestionDto extends EndpointOptionsInterface {
  urlParams: QuestionUrlParams;
}

interface QuestionUrlParams {
  vmId: string;
}
