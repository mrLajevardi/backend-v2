import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sessions } from 'src/infrastructure/database/entities/Sessions';
import { CreateSessionsDto } from 'src/application/base/sessions/dto/create-sessions.dto';
import { UpdateSessionsDto } from 'src/application/base/sessions/dto/update-sessions.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UserService } from '../user/user.service';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Sessions)
    private readonly repository: Repository<Sessions>,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
  ) {}

  // Find One Item by its ID
  async findById(id: number): Promise<Sessions> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<Sessions[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<Sessions> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateSessionsDto) {
    const newItem = plainToClass(Sessions, dto);
    const createdItem = this.repository.create(newItem);
    await this.repository.save(createdItem);
  }

  async createAdminSession(userId) {
    throw new InternalServerErrorException('MUST BE IMPLEMENTED');
    //This part is because of preventing errors and should be deleted
    const sessionData = { sessionId: '1', token: '' };
    // const sessionData = await mainWrapper.admin.user.createSession()
    //     .providerSession(
    //         vcdAuth.username, vcdAuth.password, this.sysOrgName,
    //     );
    await this.create({
      isAdmin: true,
      orgId: null, // DOUBLE CHECK THIS PART , this part changed after MOVE
      sessionId: sessionData.sessionId,
      token: sessionData.token,
      active: true,
      createDate: new Date(),
      updateDate: new Date(),
    });
    return Promise.resolve(sessionData);
  }

  async createUserSession(orgId, userId) {
    const user = await this.userService.findById(userId);
    const org = await this.organizationService.findById(orgId);
    const filteredUsername = user.username.replace('@', '_').replace('.', '_');
    throw new InternalServerErrorException('MUST BE IMPLEMENTED');
    //This part is because of preventing errors and should be deleted
    const sessionData = { sessionId: '1', token: '' };
    //
    // const sessionData = await mainWrapper.admin.user.createSession()
    //     .userSession(filteredUsername, user.vdcPassword, org.name);
    this.create({
      isAdmin: false,
      orgId,
      sessionId: sessionData.sessionId,
      token: sessionData.token,
      active: true,
      createDate: new Date(),
      updateDate: new Date(),
    });
    return Promise.resolve(sessionData);
  }

  // Update an Item using updateDTO
  async update(id: number, dto: UpdateSessionsDto) {
    const item = await this.findById(id);
    const updateItem: Partial<Sessions> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: number) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }

  /**
   * checks admin session
   * @return {Promise}
   */
  async checkAdminSession(userId: string) {
    const session = await this.findOne({
      where: {
        and: [{ isAdmin: true }, { active: true }],
      },
    });
    if (session) {
      const currentDate = new Date().getTime() + 1000 * 60;
      const sessionExpire =
        new Date(session.createDate).getTime() + 1000 * 60 * 30;
      if (sessionExpire > currentDate) {
        return Promise.resolve(session.token);
      } else {
        await this.update(session.id, {
          active: false,
        });
        //const adminSession = new AdminSession(this.userId, t);
        const createdSession = await this.createAdminSession(userId);
        return Promise.resolve(createdSession.token);
      }
    } else {
      // const adminSession = new AdminSession(null,this.userId);
      const createdSession = await this.checkAdminSession(userId);
      return Promise.resolve(createdSession.token);
    }
  }
  /**
   * @param {String} orgId
   * @return {Promise}
   */
  async checkUserSession(orgId, userId) {
    const session = await this.findOne({
      where: {
        and: [{ orgId }, { active: true }],
      },
    });
    if (session) {
      const currentDate = new Date().getTime() + 1000 * 60;
      const sessionExpire =
        new Date(session.createDate).getTime() + 1000 * 60 * 30;
      if (sessionExpire > currentDate) {
        return Promise.resolve(session.token);
      } else {
        await this.update(session.id, {
          active: false,
        });
        const createdSession = await this.createUserSession(orgId, userId);
        return Promise.resolve(createdSession.token);
      }
    } else {
      const createdSession = await this.createUserSession(orgId, userId);
      return Promise.resolve(createdSession.token);
    }
  }
}
