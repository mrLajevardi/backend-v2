import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Query, Request } from '@nestjs/common';
import { DiskBusUnitBusNumberSpace } from '../../../wrappers/mainWrapper/user/vm/diskBusUnitBusNumberSpace';
import { VmDetailService } from '../service/vm-detail.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { VmEventQueryDto } from '../dto/vm-event.query.dto';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SortDateTypeEnum } from '../../../infrastructure/filters/sort-date-type.enum';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from 'src/application/base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from 'src/application/base/security/ability/enum/acl-subjects.enum';
import { Action } from 'src/application/base/security/ability/enum/action.enum';
import { CheckPolicies } from 'src/application/base/security/ability/decorators/check-policies.decorator';
// import { toNumber } from 'lodash';

@ApiTags('VM-Detail')
@Controller('vm-detail')
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.VmDetail, props)),
)
// @UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VmDetailController {
  constructor(private readonly VmDetailService: VmDetailService) {}
  @ApiQuery({
    name: 'dateFilter',
    type: String,
    required: true,
    // allowEmptyValue:true
    example: 'Today',
  })
  @ApiQuery({
    name: 'serviceInstanceId',
    type: String,
    required: true,
    example: 'D7F09556-272D-47CE-A91D-8FBA51676BF4',
  })
  @ApiQuery({ name: 'vmId', type: String, required: true })
  @ApiQuery({ name: 'vappId', type: String, required: true })
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'pageSize', type: Number, required: true, example: 10 })
  @ApiQuery({
    name: 'dateBegin',
    type: Date,
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'dateEnd',
    type: Date,
    required: false,
    allowEmptyValue: true,
  })
  @Get('/monitor/events')
  async getEventsVm(
    @Query('dateFilter') dateFilter: SortDateTypeEnum,
    @Query('serviceInstanceId') serviceInstanceId: string,
    @Query('vmId') vmId: string,
    @Query('vappId') vappId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('dateBegin') dateBegin: Date,
    @Query('dateEnd') dateEnd: Date,
    @Request() options: SessionRequest,
  ) {
    return await this.VmDetailService.eventVm(options, {
      dateBegin: dateBegin,
      dateFilter: dateFilter,
      dateEnd: dateEnd,
      pageSize: pageSize,
      vmId: vmId,
      serviceInstanceId: serviceInstanceId,
      page: page,
      vappId: vappId,
    });
  }

  @ApiQuery({
    name: 'dateFilter',
    type: String,
    // enum: SortDateTypeEnum,
    required: true,
    // allowEmptyValue:true
  })
  @ApiQuery({
    name: 'serviceInstanceId',
    type: String,
    required: true,
    example: 'D7F09556-272D-47CE-A91D-8FBA51676BF4',
  })
  @ApiQuery({ name: 'vmId', type: String, required: true })
  @ApiQuery({ name: 'vappId', type: String, required: true })
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiQuery({ name: 'pageSize', type: Number, required: true })
  @ApiQuery({
    name: 'dateBegin',
    type: Date,
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'dateEnd',
    type: Date,
    required: false,
    allowEmptyValue: true,
  })
  @Get('/monitor/tasks')
  async getTasksVm(
    @Query('dateFilter') dateFilter: SortDateTypeEnum,
    @Query('serviceInstanceId') serviceInstanceId: string,
    @Query('vmId') vmId: string,
    @Query('vappId') vappId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('dateBegin') dateBegin: Date,
    @Query('dateEnd') dateEnd: Date,
    @Request() options: SessionRequest,
  ) {
    return await this.VmDetailService.tasksVm(options, {
      dateBegin: dateBegin,
      dateFilter: dateFilter,
      dateEnd: dateEnd,
      pageSize: pageSize,
      vmId: vmId,
      serviceInstanceId: serviceInstanceId,
      page: page,
      vappId: vappId,
    });
  }
}
