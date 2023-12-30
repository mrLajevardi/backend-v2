import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Public } from './application/base/security/auth/decorators/ispublic.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { SystemSettingsTableService } from './application/base/crud/system-settings-table/system-settings-table.service';
import { CheckPolicies } from './application/base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { Action } from './application/base/security/ability/enum/action.enum';
import { PredefinedRoles } from './application/base/security/ability/enum/predefined-enum.type';
import { Roles } from './application/base/security/ability/decorators/roles.decorator';
import { SystemSettings } from './infrastructure/database/entities/SystemSettings';
import { AclSubjectsEnum } from './application/base/security/ability/enum/acl-subjects.enum';
import { PolicyHandlerOptions } from './application/base/security/ability/interfaces/policy-handler.interface';

// @UseInterceptors(SentryInterceptor) // This is a test to make sure that sentry is okay !!
@Controller()
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Default, props)),
)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly systemSettingsService: SystemSettingsTableService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiBearerAuth() // Requires authentication with a JWT token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Roles(PredefinedRoles.AdminRole)
  @ApiOperation({ summary: 'get system settings' })
  @ApiResponse({ status: 200, description: 'Returns the system settings' })
  @ApiBearerAuth() // Requires authentication with a JWT token
  @CheckPolicies((ability: PureAbility) =>
    ability.cannot(Action.Manage, PredefinedRoles.AdminRole),
  )
  @Get('systemSettings')
  getSystemSettings(): Promise<SystemSettings[]> {
    return this.systemSettingsService.find();
  }
}
