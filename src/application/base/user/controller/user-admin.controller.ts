import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { UserAdminService } from '../service/user-admin.service';
import { UserService } from '../service/user.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateErrorException } from 'src/infrastructure/exceptions/create-error.exception';
import { GroupsMapping } from 'src/infrastructure/database/entities/GroupsMapping';
import { Groups } from 'src/infrastructure/database/entities/Groups';
import { User } from 'src/infrastructure/database/entities/User';
import { PostUserCreditDto } from '../dto/post-user-credit.dto';
import { UpdateUserGroupsDto } from '../dto/update-user-groups.dto';
import { PredefinedRoles } from '../../security/ability/enum/predefined-enum.type';
import { Roles } from '../../security/ability/decorators/roles.decorator';
import { PaginationReturnDto } from 'src/infrastructure/dto/pagination-return.dto';
import { Response } from 'express';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { FilteredUser } from '../types/filtered-user.type';
import { ChangePasswordAdminDto } from '../dto/change-password-admin.dto';
import { VUsers } from 'src/infrastructure/database/entities/views/v-users';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../../security/ability/interfaces/policy-handler.interface';
import { Action } from '../../security/ability/enum/action.enum';
import { AclSubjectsEnum } from '../../security/ability/enum/acl-subjects.enum';
import { CheckPolicies } from '../../security/ability/decorators/check-policies.decorator';
import { ChangeCompanyLetterStatusAdminDto } from '../dto/change-company-letter-status-admin.dto';
import {
  UserProfileResultDto,
  UserProfileResultDtoFormat,
} from '../dto/user-profile.result.dto';

@ApiTags('User-admin')
@Controller('admin/users')
@ApiBearerAuth() // Requires authentication with a JWT token
// @Roles(PredefinedRoles.AdminRole)
@CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
  ability.can(Action.Manage, subject(AclSubjectsEnum.AdminUser, props)),
)
export class UserAdminController {
  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Delete user by admin' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user to delete',
    required: true,
  })
  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: number,
    @Req() options: SessionRequest,
  ): Promise<{ message: string }> {
    await this.userAdminService.deleteUsers(options, userId);
    return { message: `User with ID ${userId} has been deleted by admin` };
  }

  @ApiOperation({ summary: 'Disable user by admin' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user to disable',
    required: true,
  })
  @Post(':userId/disable')
  async disableUser(
    @Param('userId') userId: number,
    @Req() options: SessionRequest,
  ): Promise<{ message: string }> {
    await this.userAdminService.disableUser(options, userId);
    return { message: `User with ID ${userId} has been disabled by admin` };
  }

  @ApiOperation({ summary: 'Enable user by admin' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user to enable',
    required: true,
  })
  @Post(':userId/enable')
  async enableUser(
    @Param('userId') userId: number,
    @Req() options: SessionRequest,
  ): Promise<{ message: string }> {
    await this.userAdminService.enableUser(options, userId);
    return { message: `User with ID ${userId} has been enabled by admin` };
  }

  @ApiOperation({ summary: `Get user's groups by admin` })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user to get groups for',
    required: true,
  })
  @ApiOkResponse({
    type: [GroupsMapping],
    description: `User's groups retrieved successfully`,
  })
  @Get(':userId/userGroups')
  async getUserGroupsByAdmin(
    @Param('userId') userId: number,
  ): Promise<Groups[]> {
    const userGroups: Groups[] = await this.userAdminService.getUserGroups(
      userId,
    );
    return userGroups;
  }

  @ApiOperation({ summary: 'Get detailed info of a user' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user to get detailed info for',
    required: true,
  })
  @ApiOkResponse({
    type: User,
    description: 'Detailed info of the user retrieved successfully',
  })
  @Get('userInfo/:userId')
  async getUserInfo(@Param('userId') userId: number): Promise<FilteredUser> {
    const userInfo = await this.userAdminService.getUserInfo(userId);
    return userInfo;
  }

  @ApiOperation({ summary: 'Get all users by admin' })
  // @ApiQuery({
  //   name: 'role',
  //   type: String,
  //   description: 'Filter users by role',
  //   required: false,
  // })
  @ApiQuery({
    name: 'active',
    type: String,
    description: 'Filter users by active or not active ',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    description: 'Number of items per page',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Filter users by name',
    required: false,
  })
  @ApiQuery({
    name: 'username',
    type: String,
    description: 'Filter users by username',
    required: false,
  })
  @ApiQuery({
    name: 'family',
    type: String,
    description: 'Filter users by family',
    required: false,
  })
  @ApiOkResponse({
    type: [User],
    description: 'List of users retrieved successfully',
  })
  @Get()
  async getAllUsersByAdmin(
    // @Query('role') role?: string,
    @Query('active') active?: boolean,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('name') name?: string,
    @Query('username') username?: string,
    @Query('family') family?: string,
  ): Promise<VUsers[]> {
    const users = await this.userAdminService
      .getUsers
      // // role,
      // active,
      // page,
      // pageSize,
      // name,
      // username,
      // family,
      ();
    return users;
  }

  @Post()
  @ApiOperation({ summary: 'create user : Admin ' })
  @ApiBody({ type: CreateUserDto })
  async CreateUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.userAdminService.createUser(createUserDto);
    if (!result) {
      throw new CreateErrorException('error creaging user');
    }
    return res.status(200).json({ message: 'User created successfully' });
  }

  @ApiOperation({ summary: 'Update user credit by admin' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID of the user to update credit for',
    required: true,
  })
  @ApiBody({
    type: PostUserCreditDto,
    description: 'Data to update user credit',
    required: true,
  })
  @ApiCreatedResponse({ description: 'User credit updated successfully' })
  @Post(':userId/credit')
  async updateUserCreditByAdmin(
    @Param('userId') userId: number,
    @Body() dto: PostUserCreditDto,
    @Req() options: SessionRequest,
    @Res() res: Response,
  ): Promise<Response> {
    await this.userAdminService.updateUserCredit(options, dto.credit, userId);
    return res.status(200).json({ message: 'credit updated' });
  }

  @ApiOperation({ summary: `Update user's groups by admin` })
  @ApiParam({
    name: 'userId',
    type: String,
    description: `ID of the user to update groups for`,
    required: true,
  })
  @ApiBody({
    type: UpdateUserGroupsDto,
    description: `List of group IDs to update user's groups`,
    required: true,
  })
  @ApiCreatedResponse({ description: `User's groups updated successfully` })
  @Put(':userId/userGroups')
  async updateUserGroupsByAdmin(
    @Param('userId') userId: number,
    @Body() dto: UpdateUserGroupsDto,
    @Req() options: SessionRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const updatedGroups = await this.userAdminService.updateUserGroups(
      options,
      userId,
      dto.groups,
    );
    let message = '';
    if (updatedGroups.length == 0) {
      message = 'No groups updated. no existent group id provided';
    } else {
      message = `${updatedGroups.length} groups updated. ${updatedGroups}`;
    }
    return res.status(200).json({ message: message });
  }

  @Put(':id')
  @ApiOperation({ summary: 'update user data : Admin' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Req() options: SessionRequest,
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserAdminDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.userAdminService.updateUser(options, userId, updateUserDto);
    return res.status(200).json({ message: 'User updated successfully' });
  }

  @Put(':id/changePassword')
  @ApiOperation({ summary: 'change password : Admin ' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Param('id') userId: number,
    @Body() dto: ChangePasswordAdminDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.userService.changePasswordAdmin(userId, dto.password);
    return res.status(200).json({ message: 'Password changed successfully' });
  }
  @Put(':id/changeCompanyLetterStatus')
  @ApiOperation({ summary: 'change company letter status : Admin ' })
  @ApiBody({ type: ChangeCompanyLetterStatusAdminDto })
  @ApiResponse({ type: UserProfileResultDtoFormat })
  async changeCompanyLetterStatus(
    @Param('id') userId: number,
    @Body() dto: ChangeCompanyLetterStatusAdminDto,
  ): Promise<UserProfileResultDtoFormat> {
    const data: User = await this.userAdminService.changeCompanyLetterStatus(
      userId,
      dto,
    );

    return new UserProfileResultDto().toArray(data);
  }
}
