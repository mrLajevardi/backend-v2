import {
  Controller,
  Get,
  InternalServerErrorException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from '../base/ability/guards/policies.guard';
import { CheckPolicies } from '../base/ability/decorators/check-policies.decorator';
import { Action } from '../base/ability/ability.factory';
import { PureAbility } from '@casl/ability';
import { Public } from '../base/auth/decorators/ispublic.decorator';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { InvalidUsernameException } from 'src/infrastructure/exceptions/invalid-username.exception';

@Controller('vast')
@ApiTags('vast')
@UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VastController {
  @Public()
  @ApiOperation({ summary: 'for testing auth' })
  @Get('test')
  test(): string {
    try {
      throw new InternalServerErrorException();
    } catch (error) {
      throw new InvalidUsernameException('invalid username', error);
    }
    return 'hello';
  }
}
