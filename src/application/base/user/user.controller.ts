import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBadRequestResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from 'src/infrastructure/entities/User';
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns an array of users' })
  async getUsers(): Promise<User[] | undefined> {
    return this.userService.getUsers();
  }

  @Post('hash')
  @ApiBody({ type: "string"})
  @ApiResponse({
    status: 200,
    description: 'Returns the hashed password',
  })
  async getPasswordHash(@Body('password') password: string): Promise<{ hash: string }> {
    const hash = await this.userService.getPasswordHash(password);
    return { "hash" : hash };
  }
  

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns the user with the specified ID' })
  async getUserById(@Param('id') id: number): Promise<User | undefined> {
    return this.userService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  async updateUser(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User | undefined> {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: number): Promise<DeleteResult | undefined> {
    return this.userService.delete(id);
  }
}
