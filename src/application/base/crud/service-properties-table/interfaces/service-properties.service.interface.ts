import { IBaseService } from '../../../../../infrastructure/service/IBaseService';

export const BASE_SERVICE_PROPERTIES_SERVICE =
  'BASE_SERVICE_PROPERTIES_SERVICE';
export interface BaseServicePropertiesService extends IBaseService {
  getValueBy(serviceInstanceId: string, keyName: string): Promise<string>;
}
