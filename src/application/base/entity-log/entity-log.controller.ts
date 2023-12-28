import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EntityLogService } from './service/entity-log.service';
import { isNil } from 'lodash';
import { EntityLogResultDto } from './dto/result/entity-log.result.dto';
import { EntityLog } from '../../../infrastructure/database/entities/EntityLog';

@Controller('entityLog')
@ApiTags('EntityLogs')
@ApiBearerAuth()
export class EntityLogController {
  constructor(private readonly EntityLogService: EntityLogService) {}

  @Get()
  @ApiQuery({
    name: 'entityType',
    type: String,
    description: 'entity name (for example User,Company,...)',
    required: true,
  })
  @ApiQuery({
    name: 'entityId',
    type: Number,
    description: 'entity id (for example UserId,CompanyId,...)',
    required: true,
  })
  @ApiQuery({
    name: 'field',
    type: String,
    description:
      'if you want filter fields in response (for example status changing history)',
    required: false,
  })
  async logs(
    @Request() options: SessionRequest,
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: number,
    @Query('field') field?: string,
  ) {
    const data: EntityLog[] | null = await this.EntityLogService.filter(
      options,
      entityType,
      entityId,
      !isNil(field) ? field : null,
    );

    return new EntityLogResultDto().collection(data);
  }
}
