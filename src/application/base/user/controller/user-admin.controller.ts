import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { UserAdminService } from '../service/user-admin.service';
import { UserService } from '../service/user.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateErrorException } from 'src/infrastructure/exceptions/create-error.exception';
import { UserPaginationDto } from '../dto/user-pagination.dto';
import { Public } from '../../security/auth/decorators/ispublic.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth() // Requires authentication with a JWT token
@Controller('user-admin')
export class UserAdminController {
  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly userService: UserService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all users with pagination : Admin' })
  async getAllUsers(@Query() userPaginationDto: UserPaginationDto, @Res() res) {
    const { page, limit } = userPaginationDto;
    const users = await this.userAdminService.getAllUsers(page, limit);
    return res.status(200).json(users);
  }

  @Post()
  @ApiOperation({ summary: 'create user : Admin ' })
  @ApiBody({ type: CreateUserDto })
  async CreateUser(@Body() createUserDto: CreateUserDto, @Res() res) {
    const result = await this.userAdminService.createUser(createUserDto);
    if (!result) {
      throw new CreateErrorException('error creaging user');
    }
    return res.status(200).json({ message: 'User created successfully' });
  }

  @Put(':id')
  @ApiOperation({ summary: 'update user data : Admin' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') userId,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    await this.userService.updateUser(userId, updateUserDto);
    return res.status(200).json({ message: 'User updated successfully' });
  }

  @Put(':id/changePassword')
  @ApiOperation({ summary: 'change password : Admin ' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Param('id') userId,
    @Body() dto: ChangePasswordDto,
    @Res() res,
  ) {
    await this.userService.changePassword(userId, dto.password);
    return res.status(200).json({ message: 'Password changed successfully' });
  }
}
