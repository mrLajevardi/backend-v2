import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateOrgCatalogDto extends EndpointOptionsInterface {
  urlParams: CreateOrgCatalogUrlParams;
  body: CreateOrgCatalogBody;
}

interface CreateOrgCatalogUrlParams {
  orgId: string;
}

export class CreateOrgCatalogBody {
  name: string;
  description: string;
}
