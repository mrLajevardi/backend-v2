import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from '../base/ability/guards/policies.guard';
import { CheckPolicies } from '../base/ability/decorators/check-policies.decorator';
import { Action, AppAbility } from '../base/ability/ability.factory';
import { Acl } from 'src/infrastructure/database/entities/Acl';

@Controller('vast')
@ApiTags('vast')
@ApiBearerAuth() // Requires authentication with a JWT token

export class VastController {

    @ApiOperation({ summary: 'for testing auth' })
    @Get('test')
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Acl))
    test() : string {
        return 'hello';
    }
    
}
