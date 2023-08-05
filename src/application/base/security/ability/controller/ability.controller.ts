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

@Public()
@ApiTags('Ability')
@Controller('ability')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AbilityController {
  constructor(
    private readonly abilityAdminService: AbilityAdminService,
    private readonly aclTable : ACLTableService
    ) {}

  @Get('/:userId/predefined-roles')
  @ApiResponse({ status: 200, type: PredefinedRoleDto, isArray: true })
  @ApiOperation({ summary: 'returns all predefined roles for the user' })
  async getAllPredefinedRoles(
    @Param('userId') userId: number,
  ): Promise<PredefinedRoleDto[]> {
    return this.abilityAdminService.getAllPredefinedRoles(userId);
  }

  @Get('/predefined-roles')
  @ApiResponse({ status: 200, type: PredefinedRoleDto, isArray: true })
  @ApiOperation({ summary: 'returns all predefined roles for the user' })
  async getAllMyPredefinedRoles(
    @Request() options,
  ): Promise<PredefinedRoleDto[]> {
    return this.abilityAdminService.getAllPredefinedRoles(options.user.userId);
  }

  @Post('/permit')
  @ApiOperation({ summary: 'permit an action to model ' })
  @ApiBody({
    type: AssignActionDto,
  })
  async permit(@Body() dto){

  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Retrieved ACLs successfully' })
  async getAllAcls(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    @Query('search') search: string,
  ) {
    return this.abilityAdminService.getAllAcls(page, pageSize, search);
  }

  @Post()
  @ApiBody({ type: CreateACLDto })
  @ApiResponse({ status: 201, description: 'Created ACL successfully' })
  async createAcl(@Body() data: UpdateACLDto): Promise<Acl> {
    return await this.aclTable.create(data);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateACLDto })
  @ApiResponse({ status: 200, description: 'Updated ACL successfully' })
  async updateAcl(@Param('id') id: number, @Body() data: UpdateACLDto): Promise<Acl> {
    return this.aclTable.update(id, data);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Deleted ACL successfully' })
  async deleteAcl(@Param('id') id: number): Promise<void> {
    return this.aclTable.delete(id);
  }


  @Post('/:userId/predefined-roles')
  @ApiOperation({ summary: 'assign a predefined role to user ' })
  @ApiProperty({ enum: PredefinedRoles, enumName: 'PredefinedRoles' })
  @ApiBody({
    type: AssignPredefinedRoleDto,
    description:
      ' role: [admin-role-template,user-role-template,sysadmin-role-template]',
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
    description:
      ' role: [admin-role-template,user-role-template,sysadmin-role-template]',
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
    description:
      ' role: [admin-role-template,user-role-template,sysadmin-role-template]',
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
