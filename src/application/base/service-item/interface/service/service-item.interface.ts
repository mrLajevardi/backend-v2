import { IBaseService } from '../../../../../infrastructure/service/IBaseService';

export const BASE_SERVICE_ITEM_SERVICE = 'BASE_SERVICE_ITEM_SERVICE';
export interface BaseServiceItem extends IBaseService {
  getGuarantyTitleBy(serviceInstanceId: string): Promise<string>;
}
