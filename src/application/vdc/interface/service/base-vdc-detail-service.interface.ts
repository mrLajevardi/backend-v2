import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { AdminOrgVdcStorageProfileQuery } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { VdcInvoiceDetailsInfoResultDto } from '../../dto/vdc-invoice-details-info.result.dto';
import { VdcDetailsResultDto } from '../../dto/vdc-details.result.dto';

export const BASE_VDC_DETAIL_SERVICE = 'BASE_VDC_DETAIL_SERVICE';
export interface BaseVdcDetailService extends IBaseService {
  getStorageDetailVdc(
    vdcId: string,
    options: SessionRequest,
  ): Promise<VdcInvoiceDetailsInfoResultDto[]>;

  getVdcDetail(serviceInstanceId: string): Promise<VdcDetailsResultDto>;
}
