import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Request,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AbilityAdminService } from '../service/ability-admin.service';
import { PredefinedRoles } from '../enum/predefined-enum.type';
import { PredefinedRoleDto } from '../dto/predefined-role.dto';
import { AssignPredefinedRoleDto } from '../dto/assign-predefined-role.dto';
import { AssignActionDto } from '../dto/assign-action.dto';
import { Public } from '../../auth/decorators/ispublic.decorator';
import { Acl } from 'src/infrastructure/database/entities/Acl';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { CreateACLDto } from 'src/application/base/crud/acl-table/dto/create-acls.dto';
import { UpdateACLDto } from 'src/application/base/crud/acl-table/dto/update-acls.dto';
import { Roles } from '../decorators/roles.decorator';
import { Action } from '../enum/action.enum';
import { DeleteOptions } from 'typeorm';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { GetAllAclsDto } from '../dto/get-all-acls.dto';
import { User } from '@sentry/node';
import { PolicyHandlerOptions } from '../interfaces/policy-handler.interface';
import { PureAbility, subject } from '@casl/ability';
import { CheckPolicies } from '../decorators/check-policies.decorator';
import { AclSubjectsEnum } from '../enum/acl-subjects.enum';

@ApiTags('Ability')
@Controller('ability')
@ApiBearerAuth() // Requires authentication with a JWT token
// @Roles(PredefinedRoles.SuperAdminRole)
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.Ability, props)),
)
export class AbilityController {
  constructor(
    private readonly abilityAdminService: AbilityAdminService,
    private readonly aclTable: ACLTableService,
  ) {}

  @Get('/:userId/predefined-roles')
  @ApiResponse({ status: 200, type: PredefinedRoleDto, isArray: true })
  @ApiOperation({ summary: 'returns all predefined roles for the user' })
  async getAllPredefinedRoles(
    @Param('userId') userId: number,
  ): Promise<string[]> {
    return await this.abilityAdminService.getAllPredefinedRoles(userId);
  }

  @Get('/predefined-roles')
  @ApiResponse({ status: 200, type: PredefinedRoleDto, isArray: true })
  @ApiOperation({ summary: 'returns all predefined roles for the user' })
  async getAllMyPredefinedRoles(
    @Request() options: SessionRequest,
  ): Promise<string[]> {
    return await this.abilityAdminService.getAllPredefinedRoles(
      options.user.userId,
    );
  }

  @Get('/predefined-roles/users')
  @ApiResponse({ status: 200, type: PredefinedRoleDto, isArray: true })
  @ApiOperation({ summary: 'returns all predefined roles for the user' })
  @ApiQuery({ name: 'role', type: 'string' })
  async getUsersWithPredefinedRole(
    @Request() options: SessionRequest,
    @Query('role') role,
  ) {
    return await this.abilityAdminService.getUsersWithPredefinedRole(role);
  }

  @Public()
  @Get('/predefined-roles/list')
  @ApiResponse({ status: 200, type: String, isArray: true })
  @ApiOperation({
    summary: 'returns all predefined roles usable in this system',
  })
  async getListOfPredefinedRoles(): Promise<string[]> {
    const roles = Object.values(PredefinedRoles);
    return roles;
  }

  @Public()
  @Get('/actions/list')
  @ApiResponse({ status: 200, type: String, isArray: true })
  @ApiOperation({ summary: 'returns all actions in system' })
  async getListOfActions(): Promise<string[]> {
    const actions = Object.values(Action);
    return actions;
  }

  @Public()
  @Get('/models/list')
  @ApiResponse({ status: 200, type: String, isArray: true })
  @ApiOperation({ summary: 'returns all models available in system' })
  async getListOfModels(): Promise<string[]> {
    return await this.abilityAdminService.getListOfModels();
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Retrieved ACLs successfully' })
  async getAllAcls(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('search') search: string,
  ): Promise<GetAllAclsDto> {
    return await this.abilityAdminService.getAllAcls(page, pageSize, search);
  }

  @Post()
  @ApiBody({ type: CreateACLDto })
  @ApiResponse({ status: 201, description: 'Created ACL successfully' })
  async createAcl(@Body() data: CreateACLDto): Promise<Acl> {
    return await this.aclTable.create(data);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateACLDto })
  @ApiResponse({ status: 200, description: 'Updated ACL successfully' })
  async updateAcl(
    @Param('id') id: number,
    @Body() data: UpdateACLDto,
  ): Promise<Acl> {
    return await this.aclTable.update(id, data);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Deleted ACL successfully' })
  async deleteAcl(@Param('id') id: number): Promise<DeleteOptions> {
    return await this.aclTable.delete(id);
  }

  @Post('/:userId/predefined-roles')
  @ApiOperation({ summary: 'assign a predefined role to user ' })
  @ApiProperty({ enum: PredefinedRoles, enumName: 'PredefinedRoles' })
  @ApiBody({
    type: AssignPredefinedRoleDto,
  })
  async assignPredefinedRole(
    @Param('userId') userId: number,
    @Body() assignPredefinedRoleDto: AssignPredefinedRoleDto,
  ): Promise<void> {
    await this.abilityAdminService.assignPredefinedRole(
      userId,
      assignPredefinedRoleDto.role,
    );
  }

  @Delete('/:userId/predefined-roles')
  @ApiOperation({ summary: 'delete a predefined role from user ' })
  @ApiBody({
    type: AssignPredefinedRoleDto,
  })
  async deletePredefinedRole(
    @Param('userId') userId: number,
    @Body() dto: AssignPredefinedRoleDto,
  ): Promise<void> {
    console.log(userId, dto);
    await this.abilityAdminService.deletePredefinedRole(userId, dto.role);
  }

  @Post('/:userId/predefined-roles/deny')
  @ApiOperation({ summary: 'deny a predefined role from user ' })
  @ApiBody({
    type: AssignPredefinedRoleDto,
  })
  async denyPredefinedRole(
    @Param('userId') userId: number,
    @Body() dto: AssignPredefinedRoleDto,
  ): Promise<void> {
    await this.abilityAdminService.denyPredefinedRole(userId, dto.role);
  }

  @Post('/:userId/permit')
  @ApiOperation({ summary: 'permit an access type to a model for a user ' })
  @ApiBody({
    type: AssignActionDto,
    description:
      'action : [read,write,manage,update,delete], On: casl Subject name',
  })
  async permitAccessToUser(
    @Param('userId') userId: number,
    @Body() dto: AssignActionDto,
  ): Promise<void> {
    await this.abilityAdminService.permitAccessToUser(
      dto.action,
      dto.on,
      userId,
    );
  }

  @Post('/:userId/revoke')
  @ApiOperation({ summary: 'deny an access type from a model for a user ' })
  @ApiBody({
    type: AssignActionDto,
    description:
      'action : [read,write,manage,update,delete], On: casl Subject name',
  })
  async denyAccessFromUser(
    @Param('userId') userId: number,
    @Body() dto: AssignActionDto,
  ): Promise<void> {
    await this.abilityAdminService.denyAccessFromUser(
      dto.action,
      dto.on,
      userId,
    );
  }

  @Delete('/:userId/access')
  @ApiOperation({ summary: 'delete an access type from a model for a user ' })
  @ApiBody({
    type: AssignActionDto,
    description:
      'action : [read,write,manage,update,delete], On: casl Subject name',
  })
  async deleteAccessForUser(
    @Param('userId') userId: number,
    @Body() dto: AssignActionDto,
  ): Promise<void> {
    await this.abilityAdminService.deleteAccessForUser(
      dto.action,
      dto.on,
      userId,
    );
  }
}
