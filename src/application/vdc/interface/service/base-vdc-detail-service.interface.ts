import { IBaseService } from '../../../../infrastructure/service/IBaseService';
import { AdminOrgVdcStorageProfileQuery } from '../../../../wrappers/main-wrapper/service/user/vdc/dto/instantiate-vm-from.templates-admin.dto';
import { SessionRequest } from '../../../../infrastructure/types/session-request.type';
import { VdcInvoiceDetailsInfoResultDto } from '../../dto/vdc-invoice-details-info.result.dto';
import { VdcDetailsResultDto } from '../../dto/vdc-details.result.dto';
import { VdcDetailItemResultDto } from '../../dto/vdc-detail-item.result.dto';
import { VdcItemLimitResultDto } from '../../dto/vdc-Item-limit.result.dto';
import { VdcStoragesDetailResultDto } from '../../dto/vdc-storages-detail.result.dto';
import { VdcDetailEditGeneralQuery } from '../../dto/vdc-detail-edit-general.query';
import { BadRequestException } from '../../../../infrastructure/exceptions/bad-request.exception';

export const BASE_VDC_DETAIL_SERVICE = 'BASE_VDC_DETAIL_SERVICE';
export interface BaseVdcDetailService extends IBaseService {
  getStorageDetailVdc(
    serviceInstanceId: string,
    memoryAllocation: number,
    numberOfvms: number,
    option: SessionRequest,
  ): Promise<VdcStoragesDetailResultDto[]>;

  getVdcDetail(
    serviceInstanceId: string,
    option: SessionRequest,
  ): Promise<VdcDetailsResultDto>;

  getVdcDetailItems(
    option: SessionRequest,
    serviceInstanceId: string,
  ): Promise<VdcDetailItemResultDto>;

  getVdcItemLimit(
    serviceInstanceId: string,
    option: SessionRequest,
  ): Promise<VdcItemLimitResultDto>;

  editGeneralInfo(
    option: SessionRequest,
    query: VdcDetailEditGeneralQuery,
  ): Promise<string | BadRequestException>; // TODO ==> Refactor Result Of This Service
}
