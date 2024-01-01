import {
  Controller,
  Get,
  InternalServerErrorException,
  UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../base/security/auth/decorators/ispublic.decorator';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { InvalidUsernameException } from 'src/infrastructure/exceptions/invalid-username.exception';
import { CheckPolicies } from '../base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from '../base/security/ability/enum/acl-subjects.enum';
import { Action } from '../base/security/ability/enum/action.enum';

@Controller('vast')
@ApiTags('vast')
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Vast, props)),
)
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
