import { instanceToPlain } from 'class-transformer';
import { ServiceStatusEnum } from 'src/application/base/service/enum/service-status.enum';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';

export class ServiceInstanceModel {
  UserID: number;
  Status: ServiceStatusEnum;
  CreateDate: Date;
  LastUpdateDate: Date;
  ExpireDate: Date;
  DeletedDate: Date;
  IsDeleted: boolean;
  Index: number;
  WarningSent: number;
  IsDisabled: boolean;
  Name: string;
  PlanRatio: number;
  LastPAYG: Date;
  NextPAYG: Date;
  DatacenterName: string | null;
  ID: string;
}

export class ServiceInstancesDto {
  userId: number;
  id: string;
  status: ServiceStatusEnum;
  createDate: Date;
  lastUpdateDate: Date;
  expireDate: Date;
  deletedDate: Date;
  isDeleted: boolean;
  index: number;
  warningSent: number;
  isDisabled: boolean;
  name: string;
  planRatio: number;
  lastPayg: Date;
  nextPayg: Date;
  datacenterName: string | null;

  constructor(dto: ServiceInstanceModel) {
    this.userId = dto.UserID;
    this.id = dto.ID;
    this.createDate = dto.CreateDate;
    this.datacenterName = dto.DatacenterName;
    this.deletedDate = dto.DeletedDate;
    this.index = dto.Index;
    this.isDeleted = dto.IsDeleted;
    this.isDisabled = dto.IsDisabled;
    this.expireDate = dto.ExpireDate;
    this.lastUpdateDate = dto.LastUpdateDate;
    this.lastPayg = dto.LastPAYG;
    this.nextPayg = dto.NextPAYG;
    this.name = dto.Name;
    this.status = dto.Status;
    this.warningSent = dto.WarningSent;
    this.planRatio = dto.PlanRatio;
  }

  build(): ServiceInstances {
    const result = instanceToPlain(this);
    return result as ServiceInstances;
  }
}
