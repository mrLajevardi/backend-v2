import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { ItemTypesConfig } from '../../../../infrastructure/database/entities/ItemTypesConfig';

export interface IDatacenterTableService extends IBaseService {
  findBy(
    generationId: string,
    serviceTypeId: string,
  ): Promise<ItemTypesConfig[]>;
}
