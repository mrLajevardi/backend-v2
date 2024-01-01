import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteTemplateDto extends EndpointOptionsInterface {
  urlParams: DeleteTemplateUrlParams;
}

interface DeleteTemplateUrlParams {
  templateId: string;
}
