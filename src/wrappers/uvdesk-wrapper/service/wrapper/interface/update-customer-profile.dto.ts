import { UvdeskBooleanEnum } from '../../endpoints/enum/uvdesk-boolean.enum';

export interface UpdateCustomerProfileBodyDto {
  profile?: Buffer;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  isActive: UvdeskBooleanEnum;
}
