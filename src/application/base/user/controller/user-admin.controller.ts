import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { UserAdminService } from '../service/user-admin.service';
import { UserService } from '../service/user.service';
import { ChangePasswordDto } from '../dto/change-password.dto';


@ApiTags('Users')
@Controller('users')
@ApiBearerAuth() // Requires authentication with a JWT token
@Controller('user-admin')
export class UserAdminController {

    constructor(
        private readonly userAdminService: UserAdminService,
        private readonly userService: UserService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'create user : Admin ' })
    @ApiBody({ type: CreateUserDto })
    async CreateUser(
        @Body() createUserDto: CreateUserDto) {
        return await this.userAdminService.createUser(createUserDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'update user data' })
    @ApiBody({ type: UpdateUserDto })
    async updateUser(
        @Param('id') userId,
        @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateUser(userId, updateUserDto);
    }

    @Put(':id/changePassword')
    @ApiOperation({ summary: 'change password ' })
    @ApiBody({ type: ChangePasswordDto  })
    async changePassword(
        @Param('id') userId,
        @Body() dto: ChangePasswordDto) {
        return await this.userService.changePassword(userId, dto.password);
    }

}
