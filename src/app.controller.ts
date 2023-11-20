import {
  Controller,
  Get,
  UseGuards,
  Request,
  // UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, /*ApiBody*/ ApiResponse } from '@nestjs/swagger';
// import { LocalAuthGuard } from './application/base/security/auth/guard/local-auth.guard';
import { Public } from './application/base/security/auth/decorators/ispublic.decorator';
import { ApiOperation } from '@nestjs/swagger';
// import { AuthService } from './application/base/security/auth/service/auth.service';
// import { LoginDto } from './application/base/security/auth/dto/login.dto';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { SystemSettingsTableService } from './application/base/crud/system-settings-table/system-settings-table.service';
import { CheckPolicies } from './application/base/security/ability/decorators/check-policies.decorator';
import { PureAbility } from '@casl/ability';
import { Action } from './application/base/security/ability/enum/action.enum';
// import { PoliciesGuard } from './application/base/security/ability/guards/policies.guard';
// import { SentryInterceptor } from './infrastructure/logger/Interceptors/SentryInterceptor';
import { PredefinedRoles } from './application/base/security/ability/enum/predefined-enum.type';
import { Roles } from './application/base/security/ability/decorators/roles.decorator';
import { SystemSettings } from './infrastructure/database/entities/SystemSettings';

// @UseInterceptors(SentryInterceptor) // This is a test to make sure that sentry is okay !!
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly systemSettingsService: SystemSettingsTableService,
  ) {}

  // @Get()
  // @Public()
  // getHello(
  // ): string {
  //   return this.appService.getHello();
  // }

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Get user profile 3' })
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
    ability.can(Action.Manage, PredefinedRoles.AdminRole),
  )
  @Get('systemSettings')
  getSystemSettings(): Promise<SystemSettings[]> {
    return this.systemSettingsService.find();
  }
}
