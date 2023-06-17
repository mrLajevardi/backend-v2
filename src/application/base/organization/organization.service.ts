import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/infrastructure/database/entities/Organization';
import { CreateOrganizationDto } from 'src/application/base/organization/dto/create-organization.dto';
import { UpdateOrganizationDto } from 'src/application/base/organization/dto/update-organization.dto';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { TasksService } from '../tasks/service/tasks.service';
import { SessionsService } from '../sessions/sessions.service';
import { ServiceInstancesService } from '../service/service-instances/service-instances.service';
import { ServicePropertiesService } from '../service/service-properties/service-properties.service';
import { ServiceItemsService } from '../service/service-items/service-items.service';
import { ConfigsService } from '../service/configs/configs.service';
import { UserService } from '../user/user/user.service';
import mainWrapper from 'src/wrappers/mainWrapper/mainWrapper';
import vcdConfig from 'src/wrappers/mainWrapper/vcdConfig';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
    private readonly taskService: TasksService,
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceService: ServiceInstancesService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly serviceItemsService: ServiceItemsService,
    private readonly configService: ConfigsService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Organization> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Organization[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Organization> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateOrganizationDto) : Promise<Organization> {
    const newItem = plainToClass(Organization, dto);
    const createdItem = this.repository.create(newItem);
    const savedItem = await this.repository.save(createdItem);
    return savedItem; 
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateOrganizationDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Organization> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

    // update many items
    async updateAll(
      where: FindOptionsWhere<Organization>,
      dto: UpdateOrganizationDto,
    ) {
      await this.repository.update(where, dto);
    }

    
  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }


  async initOrg(userId) {
    const sessionToken = await this.sessionService.checkAdminSession(userId);
    const user = await this.userService.findById(userId);
    const filteredUsername = user.username.replace('@', '_').replace('.', '_');
    const name = `${filteredUsername}_org`;
    const checkOrg = await mainWrapper.admin.org.getOrg({
      filter: `name==${name}`,
      page: 1,
      pageSize: 25,
    }, sessionToken);
    console.log(checkOrg);
    // if org exists in cloud save it into database
    if (checkOrg.values.length > 0) {
      const createdOrg = await this.create({
        name,
        dsc: 'none',
        createDate: new Date(),
        updateDate: new Date(),
        userId: userId,
        orgId: checkOrg.values[0].id,
        status: '1',
      });

      return Promise.resolve({
        id: createdOrg.id,
        vcloudOrgId: checkOrg.values[0].id,
        name: checkOrg.values[0].name,
        __vcloudTask: null,
      });
    }
    const orgInfo = await mainWrapper.admin.org.createOrg(name, sessionToken);
    const createdOrg = await this.create({
      name,
      dsc: 'none',
      createDate: new Date(),
      updateDate: new Date(),
      userId: userId,
      orgId: orgInfo.id,
      status: '1',
    });
    const checkUser = await mainWrapper.user.vdc.vcloudQuery(sessionToken, {
      type: 'user',
      filter: `name==${filteredUsername}`,
    }, {
      'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgInfo.id.split('org:')[1],
    });
    if (checkUser.data.record.length > 0) {
      return Promise.resolve({
        id: createdOrg.id,
        vcloudOrgId: orgInfo.id,
        name: createdOrg.name,
        __vcloudTask: null,
      });
    }
    await mainWrapper.admin.user.createUser({
      orgId: orgInfo.id,
      orgName: createdOrg.name,
      username: filteredUsername,
      authToken: sessionToken,
      password: user.vdcPassword,
      roleId: vcdConfig.admin.users.roleEntityRefs.id,
      roleName: vcdConfig.admin.users.roleEntityRefs.name,
    });
    // user created
    await this.updateAll({id: createdOrg.id}, {
      status: '2',
    });
    return Promise.resolve({
      id: createdOrg.id,
      vcloudOrgId: orgInfo.id,
      name: createdOrg.name,
      __vcloudTask: null,
    });
  }


}
