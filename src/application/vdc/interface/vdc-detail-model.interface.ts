import { BaseModelDto } from '../../../infrastructure/dto/base.model.dto';

export class VdcDetailModel implements BaseModelDto {
  constructor(item) {
    this.name = item.Name;
    this.status = item.Status;
    this.daysLeft = item.DaysLeft;
    this.servicePlanType = item.ServicePlanType;
    this.value = item.Value;
    this.itemTypeId = item.ItemTypeId;
    this.codeHierarchy = item.CodeHierarchy;
    this.datacenterName = item.DatacenterName;
    this.code = item.Code;
    this.title = item.Title;
    this.unit = item.Unit;
    this.min = item.Min;
    this.max = item.Max;
  }
  name: string;
  status: number;
  daysLeft: number;
  servicePlanType: number;
  value: string;
  itemTypeId: number;
  codeHierarchy: string;
  datacenterName: string;
  code: string;
  title: string;
  unit: string;
  min: number;
  max: number;
}
