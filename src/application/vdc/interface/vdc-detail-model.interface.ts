import { BaseModelDto } from '../../../infrastructure/dto/base.model.dto';

export class VdcDetailModel implements BaseModelDto {
  constructor(item) {
    this.name = item.name;
    this.status = item.status;
    this.daysLeft = item.daysLeft;
    this.servicePlanType = item.servicePlanType;
    this.value = item.value;
    this.itemTypeId = item.itemTypeId;
    this.codeHierarchy = item.codeHierarchy;
    this.datacenterName = item.datacenterName;
    this.code = item.code;
    this.title = item.title;
    this.unit = item.unit;
    this.min = item.min;
    this.max = item.max;
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
