import { Acl } from 'src/infrastructure/database/entities/Acl';

export class GetAllAclsDto {
  data: Acl[];
  page: number;
  pageSize: number;
  totalItems: number;
}
