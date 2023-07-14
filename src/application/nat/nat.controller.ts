import { Controller, Post, Request , Param, Body, Delete, Get, Req, Put  } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { NatDto } from './dto/nat.dto';
import { NatService } from './nat.service';

@Controller('nat')
export class NatController {

    constructor(
        private readonly service : NatService,
    ){}

    @Post('/:serviceInstanceId')
    @ApiOperation({ summary: 'creates a nat for user'})
    @ApiParam({ name: 'data', description: ' data '})
    @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID'})
    async createNatRule(
        @Request() options,
        @Param('serviceInstanceId') serviceInstanceId: string,
        @Body() data: NatDto
    ) : Promise<any> {
        return await this.service.createNatRule(data, options, serviceInstanceId);
    }

    @Delete('/:serviceInstanceId/:ruleId')
    @ApiOperation({ summary: 'creates a nat for user'})
    @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID'})
    @ApiParam({ name: 'ruleId', description: 'rule id'})
    async deleteNatRule(
        @Request() options,
        @Param('vdcInstanceId') serviceInstanceId: string,
        @Param('ruleId') ruleId: string
    ) : Promise<any> {
        return await this.service.deleteNatRule(options,serviceInstanceId,ruleId);
    }

    @Get('/:serviceInstanceId/:ruleId')
    @ApiOperation({ summary: 'get user nat'})
    @ApiParam({ name: 'serviceInstanceId', description: 'service instance ID'})
    @ApiParam({ name: 'ruleId', description: 'rule id'})
    async getNatRule (
        @Request() options,
        @Param('serviceInstanceId') serviceInstanceId: string, 
        @Param('ruleId') ruleId: string
    ) : Promise<any> {
        return await this.service.getNatRule(options,serviceInstanceId,ruleId);
    }


    @Get('/:serviceInstanceId')
    @ApiOperation({ summary: 'get user natRules'})
    @ApiParam({ name: 'serviceInstanceId', description: 'vdc instance id '})
    @ApiParam({ name: 'pageSize', description: 'page size : number'})
    @ApiParam({ name: 'getAll', description: 'getAll : boolean'})
    async getNatRules(
        @Request() options,
        @Param('serviceInstanceId') serviceInstanceId, 
        @Param('pageSize') pageSize : number , 
        @Param('getAll') getAll : boolean , 
    ) : Promise<any> {
        return await this.service.getNatRules(options,serviceInstanceId, pageSize, getAll);
    }


    @Put('/:vdcInstanceId/:ruleId')
    @ApiOperation({ summary: ' update natRule '})
    @ApiParam({ name: 'serviceInstanceId', description: 'vdc instance id '})
    @ApiParam({ name: 'ruleId', description: 'rule id '})
    async updateNatRuleConfig(
        @Request() options,
        @Param('serviceInstanceId') serviceInstanceId : string ,
        @Param('ruleId') ruleId : string ,
        @Body() data : NatDto,
    ) {
        return await this.service.updateNatRule(data, options,serviceInstanceId, ruleId);
    }

}
