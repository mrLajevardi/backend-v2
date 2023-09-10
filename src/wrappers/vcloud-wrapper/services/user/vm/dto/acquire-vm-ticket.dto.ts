import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface AcquireVmTicketDto extends EndpointOptionsInterface {
  urlParams: AcquireVmTicketUrlParams;
}

interface AcquireVmTicketUrlParams {
  vmId: string;
}
