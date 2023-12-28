import { BaseResultDto } from '../../../../infrastructure/dto/base.result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';
import { ServiceItemDto } from './service-item.dto';
import { faker } from '@faker-js/faker';
import { ServiceStatusEnum } from '../enum/service-status.enum';

export type TaskDetail = {
  taskId: string;
  operation: string;
  details: string;
  currentStep: string;
  startTime: Date;
};
export class GetAllVdcServiceWithItemsResultDto extends BaseResultDto {
  @ApiProperty({ type: Number, description: 'ServiceInstanceId' })
  id?: string;

  // @ApiProperty({  enum: ServiceStatusEnum ,})
  status?: ServiceStatusEnum;

  @ApiProperty({ type: Number })
  isDeleted?: boolean;

  @ApiProperty({ type: Number })
  name?: string;

  @ApiProperty({ type: Number })
  serviceTypeId?: string;

  @ApiProperty({ type: Number })
  serviceItems?: ServiceItemDto[];

  @ApiProperty({ type: Boolean })
  daysLeft?: number;

  @ApiProperty({ type: Boolean })
  ticketSent?: boolean;

  taskDetail?: TaskDetail;

  // @ApiProperty({  enum: ServicePlanTypeEnum })
  servicePlanType?: ServicePlanTypeEnum;

  description?: string;

  extendable?: boolean;

  createDate?: Date;

  credit?: number;

  constructor(
    id: string,
    status: ServiceStatusEnum,
    isDeleted: boolean,
    name: string,
    serviceTypeId: string,
    serviceItems: ServiceItemDto[],
    daysLeft: number,
    ticketSent: boolean,
    servicePlanType: ServicePlanTypeEnum,
    taskDetail?: TaskDetail,
    description?: string,
    extendable?: boolean,
    createDate?: Date,
    credit?: number,
  ) {
    super();
    this.id = id;
    this.status = status;
    this.isDeleted = isDeleted;
    this.name = name;
    this.serviceTypeId = serviceTypeId;
    this.serviceItems = serviceItems;
    this.taskDetail = taskDetail;
    this.daysLeft = daysLeft;
    this.ticketSent = ticketSent;
    this.servicePlanType = servicePlanType;
    this.description = description;
    this.extendable = extendable;
    this.createDate = createDate;
    this.credit = credit;
  }

  static getMock(): GetAllVdcServiceWithItemsResultDto[] {
    const res: GetAllVdcServiceWithItemsResultDto[] = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      res.push(
        new GetAllVdcServiceWithItemsResultDto(
          `SERVICE_MOCK_${i}`,
          faker.number.int({ min: 1, max: 5 }),
          faker.number.int({ min: 0, max: 1 }) === 0,
          faker.string.sample(),
          'vdc',
          ServiceItemDto.GetMock(),
          // faker.number.int({ min: 0, max: 1 }) === 0,
          faker.number.int({ min: 1, max: 90 }),
          faker.number.int({ min: 0, max: 1 }) === 0,
          faker.number.int({ min: 0, max: 1 }),
        ),
      );
    }
    return res;
  }
}
