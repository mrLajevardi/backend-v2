import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteOrgCatalogDto extends EndpointOptionsInterface {
  urlParams: DeleteOrgCatalogUrlParams;
}

interface DeleteOrgCatalogUrlParams {
  catalogId: string;
}
