import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBadRequestResponse, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AbilityAdminService } from '../service/ability-admin.service';
import { PredefinedRoles } from '../enum/predefined-enum.type';
import { PredefinedRoleDto } from '../dto/predefined-role.dto';
import { Action } from '../enum/action.enum';
import { AssignPredefinedRoleDto } from '../dto/assign-predefined-role.dto';

@ApiTags('Ability Admin')
@Controller('ability')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AbilityController {
  constructor(private readonly abilityAdminService: AbilityAdminService) {}

  @Get('/:userId/predefined-roles')
  @ApiResponse({ status: 200, type: PredefinedRoleDto, isArray: true })
  @ApiOperation({ summary: 'returns all predefined roles for the user' })
  async getAllPredefinedRoles(@Param('userId') userId: number): Promise<PredefinedRoleDto[]> {
    return this.abilityAdminService.getAllPredefinedRoles(userId);
  }

  @Post('/:userId/predefined-roles')
  @ApiOperation({ summary: 'assign a predefined role to user ' })
  @ApiProperty({ enum: PredefinedRoles, enumName: 'PredefinedRoles' })
  async assignPredefinedRole(
    @Param('userId') userId: number,
    @Body() assignPredefinedRoleDto: AssignPredefinedRoleDto,
  ): Promise<void> {
    await this.abilityAdminService.assignPredefinedRole(userId, assignPredefinedRoleDto.role);
  }

  @Delete('/:userId/predefined-roles/:role')
  @ApiOperation({ summary: 'delete a predefined role from user ' })
  async deletePredefinedRole(
    @Param('userId') userId: number,
    @Param('role') dto : AssignPredefinedRoleDto,
  ): Promise<void> {
    await this.abilityAdminService.deletePredefinedRole(userId, dto.role);
  }

  @Post('/:userId/predefined-roles/:role/deny')
  @ApiOperation({ summary: 'deny a predefined role from user ' })
  async denyPredefinedRole(
    @Param('userId') userId: number,
    @Param('role') dto : AssignPredefinedRoleDto,
  ): Promise<void> {
    await this.abilityAdminService.denyPredefinedRole(userId, dto.role);
  }

  @Post('/users/:toId/access/:accessType/:on')
  @ApiOperation({ summary: 'permit an access type to a model for a user ' })
  async permitAccessToUser(
    @Param('accessType') accessType: Action,
    @Param('on') on: string,
    @Param('toId') toId: number,
  ): Promise<void> {
    await this.abilityAdminService.permitAccessToUser(accessType, on, toId);
  }

  @Post('/users/:fromId/access/:accessType/:on/revoke')
  @ApiOperation({ summary: 'deny an access type from a model for a user ' })
  async denyAccessFromUser(
    @Param('accessType') accessType: Action,
    @Param('on') on: string,
    @Param('fromId') fromId: number,
  ): Promise<void> {
    await this.abilityAdminService.denyAccessFromUser(accessType, on, fromId);
  }

  @Delete('/:userId/access/:accessType/:on')
  @ApiOperation({ summary: 'delete an access type from a model for a user ' })
  async deleteAccessForUser(
    @Param('userId') userId: number,
    @Param('accessType') accessType: Action,
    @Param('on') on: string,
  ): Promise<void> {
    await this.abilityAdminService.deleteAccessForUser(accessType, on, userId);
  }

}