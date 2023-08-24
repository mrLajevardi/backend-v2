import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface VcloudQueryDto extends EndpointOptionsInterface {
  params: object;
}
