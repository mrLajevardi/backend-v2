import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiNotFoundResponse, ApiParam, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { GroupsTableService } from '../crud/groups-table/groups-table.service';
import { CreateGroupsDto } from '../crud/groups-table/dto/create-groups.dto';
import { UpdateGroupsDto } from '../crud/groups-table/dto/update-groups.dto';
import { Groups } from 'src/infrastructure/database/entities/Groups';
import { NotFoundException } from 'src/infrastructure/exceptions/not-found.exception';

@ApiTags('Group')
@Controller('group')
@ApiBearerAuth() // Requires authentication with a JWT token
export class GroupController {
    constructor(
        private readonly service: GroupService,
        private readonly groupTable: GroupsTableService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get groups with optional filtering and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'pageSize', required: false, type: Number })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'description', required: false, type: String })
    @ApiQuery({ name: 'color', required: false, type: String })
    @ApiOkResponse({ description: 'Successfully retrieved groups' })
    async getGroups(
        @Query('page') page: number = undefined,
        @Query('pageSize') pageSize: number = undefined,
        @Query('name') name: string = undefined,
        @Query('description') description: string = undefined,
        @Query('color') color: string = undefined,
    ) {
        const groups = await this.service.getGroups(page, pageSize, name, description, color);
        return groups;
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a group by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Group ID' })
    @ApiOkResponse({ description: 'Successfully retrieved the group', type: Groups })
    @ApiNotFoundResponse({ description: 'Group not found' })
    async getGroup(@Param('id') id: number) {
        const group = await this.groupTable.findById(id);
        if (!group) {
            throw new NotFoundException('Group not found');
        }
        return group;
    }


    @Post('/create')
    @ApiOperation({ summary: 'Create a new group' })
    @ApiBody({ type: CreateGroupsDto })
    @ApiCreatedResponse({ description: 'The group has been successfully created.', type: Groups })
    async createGroup(@Body() dto: CreateGroupsDto, @Req() request) {
        const userId = request.user.userId;
        const result = await this.groupTable.create(dto);
        await this.service.logCreateGroup(dto.name, result.id, userId);
        return result;
    }


    @Put(':id/update')
    @ApiOperation({ summary: 'Update an existing group' })
    @ApiBody({ type: UpdateGroupsDto })
    @ApiOkResponse({ description: 'The group has been successfully updated.', type: Groups })
    @ApiNotFoundResponse({ description: 'Group not found' })
    async updateGroup(@Param('id') id: number, @Body() dto: UpdateGroupsDto, @Req() request) {
        const userId = request.user.userId;
        const result = await this.groupTable.update(id, dto);
        await this.service.logUpdateGroup(dto.name, id, userId);
        return result;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a group by ID' })
    @ApiNotFoundResponse({ description: 'Group not found' })
    async deleteGroup(@Param('id') id: number, @Req() request) {
        const userId = request.user.userId;
        const result = await this.groupTable.delete(id);
        await this.service.logDeleteGroup(id, userId);
        return result;
    }
}


