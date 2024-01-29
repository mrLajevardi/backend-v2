import { EndpointOptionsInterface } from '../../../../interfaces/endpoint.interface';
import { UvdeskBooleanEnum } from '../enum/uvdesk-boolean.enum';

export interface AdminPanelLoginDto extends EndpointOptionsInterface {
  body: any;
}

export interface AdminPanelLoginBody {
  _username: string;
  _password: string;
  _remember_me: UvdeskBooleanEnum;
}
