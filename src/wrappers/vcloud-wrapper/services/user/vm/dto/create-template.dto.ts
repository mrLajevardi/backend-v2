import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateTemplateDto extends EndpointOptionsInterface {
  urlParams: CreateTemplateUrlParams;
  body: CreateTemplateBody;
}

interface CreateTemplateUrlParams {
  catalogId: string;
}
export class CreateTemplateBody {
  name: string;
  description: string;
  customizeOnInstantiate: boolean;
  source: Source;
}

class Source {
  href: string;
}
