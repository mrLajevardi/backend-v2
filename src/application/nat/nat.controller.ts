import {
  Controller,
  Post,
  Request,
  Param,
  Body,
  Delete,
  Get,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { NatDto } from './dto/nat.dto';
import { NatService } from './nat.service';
import { TempDto } from '../vdc/dto/temp.dto';

@ApiTags('Nat')
@Controller('nat')
@ApiBearerAuth()
export class NatController {
  constructor(private readonly service: NatService) {}

  @Post('/:serviceInstanceId')
  @ApiOperation({ summary: 'creates a nat for user' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  async createNatRule(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Body() data: TempDto,
  ): Promise<any> {
    return await this.service.createNatRule(data, options, serviceInstanceId);
  }

  @Delete('/:serviceInstanceId/:ruleId')
  @ApiOperation({ summary: 'creates a nat for user' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiParam({ name: 'ruleId', description: 'rule id' })
  async deleteNatRule(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('ruleId') ruleId: string,
  ): Promise<any> {
    return await this.service.deleteNatRule(options, serviceInstanceId, ruleId);
  }

  @Get('/:serviceInstanceId/:ruleId')
  @ApiOperation({ summary: 'get user nat' })
  @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID' })
  @ApiParam({ name: 'ruleId', description: 'rule id' })
  async getNatRule(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('ruleId') ruleId: string,
  ): Promise<any> {
    return await this.service.getNatRule(options, serviceInstanceId, ruleId);
  }

  @Get('/:serviceInstanceId')
  @ApiOperation({ summary: 'get user natRules' })
  @ApiParam({ name: 'serviceInstanceId', description: 'vdc instance id ' })
  @ApiQuery({ name: 'pageSize', description: 'page size : number' })
  @ApiQuery({ name: 'getAll', description: 'getAll : boolean' })
  async getNatRules(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId,
    @Query('pageSize') pageSize: number,
    @Query('getAll') getAll: boolean,
  ): Promise<any> {
    return await this.service.getNatRules(
      options,
      serviceInstanceId,
      pageSize,
      getAll,
    );
  }

  @Put('/:serviceInstanceId/:ruleId')
  @ApiOperation({ summary: ' update natRule ' })
  @ApiParam({ name: 'serviceInstanceId', description: 'vdc instance id ' })
  @ApiParam({ name: 'ruleId', description: 'rule id ' })
  async updateNatRuleConfig(
    @Request() options,
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('ruleId') ruleId: string,
    @Body() data: TempDto,
  ) {
    return await this.service.updateNatRule(
      data,
      options,
      serviceInstanceId,
      ruleId,
    );
  }
}
