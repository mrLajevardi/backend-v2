import {
  Controller,
  Post,
  Request,
  Param,
  Body,
  Delete,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NatQueryDto } from './dto/nat.dto';
import { NatService } from './nat.service';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { NatRulesListDTO } from './dto/nat-rules-list.dto';

@ApiTags('Nat')
@Controller('nat')
@ApiBearerAuth()
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Nat, props)),
// )
export class NatController {
  constructor(private readonly service: NatService) {}

  @Post('/:serviceInstanceId')
  @ApiOperation({ summary: 'creates a nat for user' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiResponse({ type: TaskReturnDto })
  async createNatRule(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Body() data: NatRulesListDTO,
  ): Promise<TaskReturnDto> {
    return await this.service.createNatRule(data, options, serviceInstanceId);
  }

  @Delete('/:serviceInstanceId/:ruleId')
  @ApiOperation({ summary: 'creates a nat for user' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiParam({ name: 'ruleId', description: 'rule id' })
  async deleteNatRule(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('ruleId') ruleId: string,
  ): Promise<TaskReturnDto> {
    return await this.service.deleteNatRule(options, serviceInstanceId, ruleId);
  }

  @Get('/:serviceInstanceId/:ruleId')
  @ApiOperation({ summary: 'get user nat' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiParam({ name: 'ruleId', description: 'rule id' })
  async getNatRule(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('ruleId') ruleId: string,
  ): Promise<any> {
    return await this.service.getNatRule(options, serviceInstanceId, ruleId);
  }

  @Get('/:serviceInstanceId')
  @ApiOperation({ summary: 'get user natRules' })
  @ApiParam({ name: 'serviceInstanceId', description: 'vdc instance id ' })
  @ApiResponse({ type: [NatRulesListDTO] })
  async getNatRules(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query() query: NatQueryDto,
  ): Promise<NatRulesListDTO[]> {
    return await this.service.getNatRules(options, serviceInstanceId, query);
  }

  @Put('/:serviceInstanceId/:ruleId')
  @ApiOperation({ summary: ' update natRule ' })
  @ApiParam({ name: 'serviceInstanceId', description: 'vdc instance id ' })
  @ApiParam({ name: 'ruleId', description: 'rule id ' })
  @ApiResponse({ type: TaskReturnDto })
  async updateNatRuleConfig(
    @Request() options: SessionRequest,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('ruleId') ruleId: string,
    @Body() data: NatRulesListDTO,
  ): Promise<TaskReturnDto> {
    return await this.service.updateNatRule(
      data,
      options,
      serviceInstanceId,
      ruleId,
    );
  }
}
