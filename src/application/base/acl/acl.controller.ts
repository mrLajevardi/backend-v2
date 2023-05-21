import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AclService } from './acl.service';
import { Acl } from 'src/infrastructure/db/entities/Acl';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ACL')
@Controller('acl')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AclController {
  constructor(private readonly aclService: AclService) {}

  @ApiOperation({ summary: 'Create a new ACL record' })
  @ApiBody({ type: Acl })
  @Post()
  async create(@Body() aclData: Partial<Acl>): Promise<Acl> {
    return await this.aclService.create(aclData);
  }

  @ApiOperation({ summary: 'Get an ACL record by ID' })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Acl | undefined> {
    return await this.aclService.findById(id);
  }

  @ApiOperation({ summary: 'Get all ACL records' })
  @Get()
  async findAll(): Promise<Acl[]> {
    return await this.aclService.findAll();
  }

  @ApiOperation({ summary: 'Update an existing ACL record' })
  @ApiBody({ type: Acl })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() aclData: Partial<Acl>,
  ): Promise<Acl | undefined> {
    return await  this.aclService.update(id, aclData);
  }

  @ApiOperation({ summary: 'Delete an ACL record' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return await this.aclService.delete(id);
  }
}
