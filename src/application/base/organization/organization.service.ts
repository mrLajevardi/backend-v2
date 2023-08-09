import { Injectable } from '@nestjs/common';
import { SessionsService } from '../sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { OrganizationTableService } from '../crud/organization-table/organization-table.service';
import { UserTableService } from '../crud/user-table/user-table.service';
import { InitOrgReturnDto } from './dto/init-org-return.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationTable: OrganizationTableService,
    private readonly sessionService: SessionsService,
    private readonly userTable: UserTableService,
  ) {}

  async initOrg(userId: number): Promise<InitOrgReturnDto> {
    const sessionToken = await this.sessionService.checkAdminSession(userId);
    const user = await this.userTable.findById(userId);
    const filteredUsername = user.username.replace('@', '_').replace('.', '_');
    const name = `${filteredUsername}_org`;
    const checkOrg = await mainWrapper.admin.org.getOrg(
      {
        filter: `name==${name}`,
        page: 1,
        pageSize: 25,
      },
      sessionToken,
    );
    console.log(checkOrg);
    // if org exists in cloud save it into database
    if (checkOrg.values.length > 0) {
      const createdOrg = await this.organizationTable.create({
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
    const createdOrg = await this.organizationTable.create({
      name,
      dsc: 'none',
      createDate: new Date(),
      updateDate: new Date(),
      userId: userId,
      orgId: orgInfo.id,
      status: '1',
    });
    const checkUser = await mainWrapper.user.vdc.vcloudQuery(
      sessionToken,
      {
        type: 'user',
        filter: `name==${filteredUsername}`,
      },
      {
        'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgInfo.id.split('org:')[1],
      },
    );
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
    await this.organizationTable.updateAll(
      { id: createdOrg.id },
      {
        status: '2',
      },
    );
    return Promise.resolve({
      id: createdOrg.id,
      vcloudOrgId: orgInfo.id,
      name: createdOrg.name,
      __vcloudTask: null,
    });
  }
}
