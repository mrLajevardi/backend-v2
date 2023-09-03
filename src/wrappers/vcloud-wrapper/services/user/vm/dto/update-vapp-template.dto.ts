import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateVAppTemplateDto extends EndpointOptionsInterface {
  urlParams: UpdateVAppTemplateUrlParams;
  body: UpdateVAppTemplateBody;
}

interface UpdateVAppTemplateUrlParams {
  templateId: string;
}

export class UpdateVAppTemplateBody {
  name: string;
  description: string;
}
