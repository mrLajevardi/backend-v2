import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1705178649876 implements MigrationInterface {
  name = 'Test1705178649876';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "security"."City" DROP CONSTRAINT "Province_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP CONSTRAINT "FK_ACL_Role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP CONSTRAINT "Company_Province_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP CONSTRAINT "Company_City_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP CONSTRAINT "LogoId_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" DROP CONSTRAINT "FK_Discounts_ServiceTypes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" DROP CONSTRAINT "FK_DebugLog_User"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP CONSTRAINT "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" DROP CONSTRAINT "FK_Configs_ServiceTypes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."GroupsMapping" DROP CONSTRAINT "FK_GroupsMapping_User"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."GroupsMapping" DROP CONSTRAINT "FK_GroupsMapping_Groups"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP CONSTRAINT "FK_ItemTypes_ServiceTypes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP CONSTRAINT "FK_InfoLog_ServiceInstances"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP CONSTRAINT "FK_InfoLog_User"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" DROP CONSTRAINT "users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroupsMappings" DROP CONSTRAINT "FK_PermissionGroupsMappings_PermissionGroups"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" DROP CONSTRAINT "FK_PermissionMappings_Permissions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" DROP CONSTRAINT "FK_PermissionMappings_PermissionGroups"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" DROP CONSTRAINT "FK_RoleMapping_Role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Sessions" DROP CONSTRAINT "orgRef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "CompanyId_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "AvatarId_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "CompanyLetterId_foreign_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" DROP CONSTRAINT "UK_principal_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" DROP COLUMN "ProvinceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" DROP COLUMN "DatacenterName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" DROP COLUMN "DatacenterName"`,
    );
    await queryRunner.query(`ALTER TABLE "logs"."InfoLog" DROP COLUMN "Name"`);
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroupsMappings" DROP COLUMN "PermissionGroupID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" DROP COLUMN "PermissionID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" DROP COLUMN "PermissionGroupID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" DROP COLUMN "RoleId"`,
    );
    await queryRunner.query(`ALTER TABLE "vdc"."Sessions" DROP COLUMN "orgId"`);
    await queryRunner.query(
      `ALTER TABLE "security"."AccessToken" ADD "realm2" nvarchar(3001) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP CONSTRAINT "PK_Files"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD CONSTRAINT "PK_Files" PRIMARY KEY ("Guid", "Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."AccessToken" DROP COLUMN "realm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."AccessToken" ADD "realm" nvarchar(3001) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "security"."City" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."City" ADD "Guid" uniqueidentifier CONSTRAINT "DF_377f5171612d75bcd716600875e" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP CONSTRAINT "PK__ACL__3213E83F4E95AFC9"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."ACL" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "Guid" uniqueidentifier NOT NULL CONSTRAINT "DF_f0d4a4def96e75844a8ccd9324d" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD CONSTRAINT "PK_f0d4a4def96e75844a8ccd9324d" PRIMARY KEY ("Guid")`,
    );
    await queryRunner.query(`ALTER TABLE "security"."ACL" DROP COLUMN "Id"`);
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "Id" decimal(18,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP COLUMN "Property"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "Property" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP COLUMN "Address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD "Address" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP COLUMN "Guid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD "Guid" uniqueidentifier CONSTRAINT "DF_9d50de03f7e6e743d2abc6604a4" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(`ALTER TABLE "Datacenter" DROP COLUMN "Password"`);
    await queryRunner.query(
      `ALTER TABLE "Datacenter" ADD "Password" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Datacenter" ADD CONSTRAINT "PK_0f60fcfe707abbdda8bb048205c" PRIMARY KEY ("CreatorId")`,
    );
    await queryRunner.query(`ALTER TABLE "Datacenter" DROP COLUMN "IntegCode"`);
    await queryRunner.query(
      `ALTER TABLE "Datacenter" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" DROP COLUMN "Title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ADD "Title" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ALTER COLUMN "Ratio" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ALTER COLUMN "Amount" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" DROP COLUMN "ServiceTypeID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ADD "ServiceTypeID" varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "logs"."DebugLog" DROP COLUMN "Url"`);
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD "Url" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" DROP COLUMN "Request"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD "Request" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" DROP COLUMN "Response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD "Response" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP COLUMN "message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD "message" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP COLUMN "stackTrace"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD "stackTrace" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP COLUMN "request"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD "request" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" DROP COLUMN "Before"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" ADD "Before" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" DROP COLUMN "After"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" ADD "After" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" DROP COLUMN "Fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" ADD "Fields" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP CONSTRAINT "PK_Files"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD CONSTRAINT "PK_a7468b3e144d2e822ac8f6b5145" PRIMARY KEY ("Id")`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD "Guid" uniqueidentifier NOT NULL CONSTRAINT "DF_23737c0dbf52594fc1ec74d6be8" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" DROP CONSTRAINT "PK_a7468b3e144d2e822ac8f6b5145"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" ADD CONSTRAINT "PK_3752dd4888e29d3397b2e62e65e" PRIMARY KEY ("Id", "Guid")`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "FileStream"`);
    await queryRunner.query(`ALTER TABLE "Files" ADD "FileStream" varbinary`);
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "FileName"`);
    await queryRunner.query(`ALTER TABLE "Files" ADD "FileName" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "IntegCode"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."Groups" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."Groups" ADD "Description" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" DROP COLUMN "ServiceTypeID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" ADD "ServiceTypeID" varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP COLUMN "Title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD "Title" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP COLUMN "Unit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD "Unit" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ALTER COLUMN "Price" float(53)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP COLUMN "Rule"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD "Rule" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ALTER COLUMN "Percent" float(53)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP CONSTRAINT "DF_59fb48106e4bc798d0a64b1447e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD CONSTRAINT "DF_59fb48106e4bc798d0a64b1447e" DEFAULT (0) FOR "IsDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP COLUMN "ActionID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD "ActionID" decimal`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD "Description" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP COLUMN "Object"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD "Object" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" DROP COLUMN "orgId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" ADD "orgId" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroups" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroups" ADD "Description" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ALTER COLUMN "AdditionRatio" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ALTER COLUMN "AdditionAmount" float(53) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD "Description" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP CONSTRAINT "DF_488cb365dc4910963d2b83f82b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP COLUMN "Condition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD "Condition" nvarchar(255) NOT NULL CONSTRAINT "DF_488cb365dc4910963d2b83f82b5" DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP CONSTRAINT "DF_3e57deb677d225779c88f483e85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD CONSTRAINT "DF_3e57deb677d225779c88f483e85" DEFAULT (1) FOR "Enabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Permissions" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Permissions" ADD "Description" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" DROP CONSTRAINT "PK_Role"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."Role" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."Role" ADD "Guid" uniqueidentifier NOT NULL CONSTRAINT "DF_2ba77f530c4841602a3a3ca6938" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" ADD CONSTRAINT "PK_2ba77f530c4841602a3a3ca6938" PRIMARY KEY ("Guid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" ADD "IntegCode" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" DROP COLUMN "Guid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" ADD "Guid" uniqueidentifier CONSTRAINT "DF_53212e8efae2d0743d009297455" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" DROP COLUMN "Title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" ADD "Title" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" ALTER COLUMN "BaseFee" float(53)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" DROP CONSTRAINT "DF_93b2dc3c8d2694c2dd944087d8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" ADD CONSTRAINT "DF_93b2dc3c8d2694c2dd944087d8b" DEFAULT (0) FOR "Type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Sessions" DROP COLUMN "sessionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Sessions" ADD "sessionId" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" ADD CONSTRAINT "UQ_1e3b0a2f4dab061a466c7218f52" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" ADD CONSTRAINT "UQ_3e014185c10de865a8aec7663c6" UNIQUE ("principal_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" DROP COLUMN "definition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" ADD "definition" varbinary`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_43891c78ace63de746d73307480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_43891c78ace63de746d73307480" DEFAULT (0) FOR "emailVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_2663b07db9832fe8d33e1f1716b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_2663b07db9832fe8d33e1f1716b" DEFAULT (1) FOR "active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_6c2f72a176dee2eb67b4ca542be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_6c2f72a176dee2eb67b4ca542be" DEFAULT (0) FOR "verificationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_7330b79d0748f9aef21c445b175"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_7330b79d0748f9aef21c445b175" DEFAULT (0) FOR "deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_c7d914e14bdc65c36b5ae9a4117"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_c7d914e14bdc65c36b5ae9a4117" DEFAULT (0) FOR "credit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP COLUMN "vdcPassword"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD "vdcPassword" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_5110bd65e48eb436d6613cf4a72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_5110bd65e48eb436d6613cf4a72" DEFAULT (0) FOR "phoneVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_e66d24f1bbe10250bee70ac8e59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_e66d24f1bbe10250bee70ac8e59" DEFAULT (0) FOR "companyOwner"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."User" DROP COLUMN "guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD "guid" uniqueidentifier CONSTRAINT "DF_f8b420d585df2b6adc0902420c7" DEFAULT newsequentialid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_97f4cf35727d43df13829dc1fd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_97f4cf35727d43df13829dc1fd3" DEFAULT (0) FOR "personalVerification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_2c6ec87415529422e3a7bf10746"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_2c6ec87415529422e3a7bf10746" DEFAULT (0) FOR "twoFactorAuth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."SystemSettings" DROP COLUMN "Value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."SystemSettings" ADD "Value" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__AccessTo__3213E83F2F499218" ON "security"."AccessToken" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__City__3214EC07AF53D481" ON "security"."City" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__ACL__3213E83F4E95AFC9" ON "security"."ACL" ("Guid") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Company__3213E83F6DC356F4" ON "security"."Company" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_Discounts" ON "services"."Discounts" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__DataLog__3214EC2711DC71D1" ON "logs"."DebugLog" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__ErrorLog__3213E83F8E8044CE" ON "logs"."ErrorLog" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__EntityLo__3214EC07CC271E87" ON "logs"."EntityLog" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_Files" ON "Files" ("Guid") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Groups__3214EC27686FB04E" ON "user"."Groups" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_services.Config" ON "services"."Configs" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__GroupsMa__3214EC2799DAAC74" ON "user"."GroupsMapping" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_ResourceTypes" ON "services"."ItemTypes" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__infoLogs__3213E83F1713A44E" ON "logs"."InfoLog" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__organiza__3213E83F513E7650" ON "vdc"."Organization" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Permissi__3214EC2736890AFB" ON "security"."PermissionGroups" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_QualityPlans" ON "services"."Plans" ("Code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Permissi__3214EC270BC5F24C" ON "security"."PermissionGroupsMappings" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Permissi__3214EC277F822875" ON "security"."Permissions" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Permissi__3214EC2738CD4D11" ON "security"."PermissionMappings" ("ID") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__RoleMapp__3213E83F75DAA2FC" ON "security"."RoleMapping" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_Role" ON "security"."Role" ("Guid") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Province__CDEB13F8B25813F1" ON "security"."Province" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Scope__3213E83F6ECDAE1D" ON "security"."Scope" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_ServiceTypes" ON "services"."ServiceTypes" ("ID", "DatacenterName") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__sessions__3213E83FD79F4A05" ON "vdc"."Sessions" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__Setting__3214EC07107FD346" ON "security"."Setting" ("Id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UK_principal_name" ON "sysdiagrams" ("principal_id", "name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__sysdiagr__C2B05B61356F80C3" ON "sysdiagrams" ("diagram_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__User__3214EC0774485CFE" ON "security"."User" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK__SystemSe__3214EC271FD0CEF8" ON "security"."SystemSettings" ("ID") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "PK__SystemSe__3214EC271FD0CEF8" ON "security"."SystemSettings"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__User__3214EC0774485CFE" ON "security"."User"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__sysdiagr__C2B05B61356F80C3" ON "sysdiagrams"`,
    );
    await queryRunner.query(`DROP INDEX "UK_principal_name" ON "sysdiagrams"`);
    await queryRunner.query(
      `DROP INDEX "PK__Setting__3214EC07107FD346" ON "security"."Setting"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__sessions__3213E83FD79F4A05" ON "vdc"."Sessions"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_ServiceTypes" ON "services"."ServiceTypes"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Scope__3213E83F6ECDAE1D" ON "security"."Scope"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Province__CDEB13F8B25813F1" ON "security"."Province"`,
    );
    await queryRunner.query(`DROP INDEX "PK_Role" ON "security"."Role"`);
    await queryRunner.query(
      `DROP INDEX "PK__RoleMapp__3213E83F75DAA2FC" ON "security"."RoleMapping"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Permissi__3214EC2738CD4D11" ON "security"."PermissionMappings"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Permissi__3214EC277F822875" ON "security"."Permissions"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Permissi__3214EC270BC5F24C" ON "security"."PermissionGroupsMappings"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_QualityPlans" ON "services"."Plans"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Permissi__3214EC2736890AFB" ON "security"."PermissionGroups"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__organiza__3213E83F513E7650" ON "vdc"."Organization"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__infoLogs__3213E83F1713A44E" ON "logs"."InfoLog"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_ResourceTypes" ON "services"."ItemTypes"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__GroupsMa__3214EC2799DAAC74" ON "user"."GroupsMapping"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_services.Config" ON "services"."Configs"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Groups__3214EC27686FB04E" ON "user"."Groups"`,
    );
    await queryRunner.query(`DROP INDEX "PK_Files" ON "Files"`);
    await queryRunner.query(
      `DROP INDEX "PK__EntityLo__3214EC07CC271E87" ON "logs"."EntityLog"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__ErrorLog__3213E83F8E8044CE" ON "logs"."ErrorLog"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__DataLog__3214EC2711DC71D1" ON "logs"."DebugLog"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK_Discounts" ON "services"."Discounts"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__Company__3213E83F6DC356F4" ON "security"."Company"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__ACL__3213E83F4E95AFC9" ON "security"."ACL"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__City__3214EC07AF53D481" ON "security"."City"`,
    );
    await queryRunner.query(
      `DROP INDEX "PK__AccessTo__3213E83F2F499218" ON "security"."AccessToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."SystemSettings" DROP COLUMN "Value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."SystemSettings" ADD "Value" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_2c6ec87415529422e3a7bf10746"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_2c6ec87415529422e3a7bf10746" DEFAULT 0 FOR "twoFactorAuth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_97f4cf35727d43df13829dc1fd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_97f4cf35727d43df13829dc1fd3" DEFAULT 0 FOR "personalVerification"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_f8b420d585df2b6adc0902420c7"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."User" DROP COLUMN "guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD "guid" uniqueidentifier CONSTRAINT "DF_f8b420d585df2b6adc0902420c7" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_e66d24f1bbe10250bee70ac8e59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_e66d24f1bbe10250bee70ac8e59" DEFAULT 0 FOR "companyOwner"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_5110bd65e48eb436d6613cf4a72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_5110bd65e48eb436d6613cf4a72" DEFAULT 0 FOR "phoneVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP COLUMN "vdcPassword"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD "vdcPassword" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_c7d914e14bdc65c36b5ae9a4117"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_c7d914e14bdc65c36b5ae9a4117" DEFAULT 0 FOR "credit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_7330b79d0748f9aef21c445b175"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_7330b79d0748f9aef21c445b175" DEFAULT 0 FOR "deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_6c2f72a176dee2eb67b4ca542be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_6c2f72a176dee2eb67b4ca542be" DEFAULT 0 FOR "verificationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_2663b07db9832fe8d33e1f1716b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_2663b07db9832fe8d33e1f1716b" DEFAULT 1 FOR "active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" DROP CONSTRAINT "DF_43891c78ace63de746d73307480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "DF_43891c78ace63de746d73307480" DEFAULT 0 FOR "emailVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" DROP COLUMN "definition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" ADD "definition" varbinary(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" DROP CONSTRAINT "UQ_3e014185c10de865a8aec7663c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" DROP CONSTRAINT "UQ_1e3b0a2f4dab061a466c7218f52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Sessions" DROP COLUMN "sessionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Sessions" ADD "sessionId" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" DROP CONSTRAINT "DF_93b2dc3c8d2694c2dd944087d8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" ADD CONSTRAINT "DF_93b2dc3c8d2694c2dd944087d8b" DEFAULT 0 FOR "Type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" ALTER COLUMN "BaseFee" float`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" DROP COLUMN "Title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ServiceTypes" ADD "Title" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" DROP CONSTRAINT "DF_53212e8efae2d0743d009297455"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" DROP COLUMN "Guid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" ADD "Guid" uniqueidentifier CONSTRAINT "DF_53212e8efae2d0743d009297455" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Province" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" DROP CONSTRAINT "DF_2ba77f530c4841602a3a3ca6938"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" DROP CONSTRAINT "PK_2ba77f530c4841602a3a3ca6938"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."Role" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."Role" ADD "Guid" uniqueidentifier NOT NULL CONSTRAINT "DF_2ba77f530c4841602a3a3ca6938" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Role" ADD CONSTRAINT "PK_Role" PRIMARY KEY ("Guid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Permissions" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Permissions" ADD "Description" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP CONSTRAINT "DF_3e57deb677d225779c88f483e85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD CONSTRAINT "DF_3e57deb677d225779c88f483e85" DEFAULT 1 FOR "Enabled"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP CONSTRAINT "DF_488cb365dc4910963d2b83f82b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP COLUMN "Condition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD "Condition" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD CONSTRAINT "DF_488cb365dc4910963d2b83f82b5" DEFAULT '' FOR "Condition"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ADD "Description" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ALTER COLUMN "AdditionAmount" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Plans" ALTER COLUMN "AdditionRatio" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroups" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroups" ADD "Description" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" DROP COLUMN "orgId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" ADD "orgId" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP COLUMN "Object"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD "Object" varchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD "Description" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" DROP COLUMN "ActionID"`,
    );
    await queryRunner.query(`ALTER TABLE "logs"."InfoLog" ADD "ActionID" int`);
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP CONSTRAINT "DF_59fb48106e4bc798d0a64b1447e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD CONSTRAINT "DF_59fb48106e4bc798d0a64b1447e" DEFAULT 0 FOR "IsDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ALTER COLUMN "Percent" float`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP COLUMN "Rule"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD "Rule" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ALTER COLUMN "Price" float`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP COLUMN "Unit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD "Unit" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" DROP COLUMN "Title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD "Title" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" DROP COLUMN "ServiceTypeID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" ADD "ServiceTypeID" varchar(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."Groups" DROP COLUMN "Description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."Groups" ADD "Description" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "IntegCode"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "FileName"`);
    await queryRunner.query(`ALTER TABLE "Files" ADD "FileName" nvarchar(MAX)`);
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "FileStream"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD "FileStream" varbinary(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" DROP CONSTRAINT "DF_23737c0dbf52594fc1ec74d6be8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" DROP CONSTRAINT "PK_3752dd4888e29d3397b2e62e65e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" ADD CONSTRAINT "PK_a7468b3e144d2e822ac8f6b5145" PRIMARY KEY ("Id")`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD "Guid" uniqueidentifier NOT NULL CONSTRAINT "DF_23737c0dbf52594fc1ec74d6be8" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" DROP CONSTRAINT "PK_a7468b3e144d2e822ac8f6b5145"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Files" ADD CONSTRAINT "PK_Files" PRIMARY KEY ("Guid", "Id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" DROP COLUMN "Fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" ADD "Fields" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" DROP COLUMN "After"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" ADD "After" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" DROP COLUMN "Before"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."EntityLog" ADD "Before" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP COLUMN "request"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD "request" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP COLUMN "stackTrace"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD "stackTrace" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" DROP COLUMN "message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD "message" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" DROP COLUMN "Response"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD "Response" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" DROP COLUMN "Request"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD "Request" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "logs"."DebugLog" DROP COLUMN "Url"`);
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD "Url" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" DROP COLUMN "ServiceTypeID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ADD "ServiceTypeID" varchar(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ALTER COLUMN "Amount" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ALTER COLUMN "Ratio" float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" DROP COLUMN "Title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ADD "Title" nvarchar(MAX) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Datacenter" DROP COLUMN "IntegCode"`);
    await queryRunner.query(
      `ALTER TABLE "Datacenter" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Datacenter" DROP CONSTRAINT "PK_0f60fcfe707abbdda8bb048205c"`,
    );
    await queryRunner.query(`ALTER TABLE "Datacenter" DROP COLUMN "Password"`);
    await queryRunner.query(
      `ALTER TABLE "Datacenter" ADD "Password" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP CONSTRAINT "DF_9d50de03f7e6e743d2abc6604a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP COLUMN "Guid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD "Guid" uniqueidentifier CONSTRAINT "DF_9d50de03f7e6e743d2abc6604a4" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP COLUMN "Address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD "Address" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP COLUMN "Property"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "Property" nvarchar(MAX)`,
    );
    await queryRunner.query(`ALTER TABLE "security"."ACL" DROP COLUMN "Id"`);
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "Id" decimal(18,0) NOT NULL IDENTITY(1,1)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP CONSTRAINT "DF_f0d4a4def96e75844a8ccd9324d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" DROP CONSTRAINT "PK_f0d4a4def96e75844a8ccd9324d"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."ACL" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD "Guid" uniqueidentifier NOT NULL CONSTRAINT "DF_f0d4a4def96e75844a8ccd9324d" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD CONSTRAINT "PK__ACL__3213E83F4E95AFC9" PRIMARY KEY ("Guid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" DROP CONSTRAINT "DF_377f5171612d75bcd716600875e"`,
    );
    await queryRunner.query(`ALTER TABLE "security"."City" DROP COLUMN "Guid"`);
    await queryRunner.query(
      `ALTER TABLE "security"."City" ADD "Guid" uniqueidentifier CONSTRAINT "DF_377f5171612d75bcd716600875e" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" DROP COLUMN "IntegCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" ADD "IntegCode" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."AccessToken" DROP COLUMN "realm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."AccessToken" ADD "realm" nvarchar(3000)`,
    );
    await queryRunner.query(`ALTER TABLE "Files" DROP CONSTRAINT "PK_Files"`);
    await queryRunner.query(
      `ALTER TABLE "Files" ADD CONSTRAINT "PK_Files" PRIMARY KEY ("Guid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."AccessToken" DROP COLUMN "realm2"`,
    );
    await queryRunner.query(`ALTER TABLE "vdc"."Sessions" ADD "orgId" int`);
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" ADD "RoleId" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" ADD "PermissionGroupID" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" ADD "PermissionID" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroupsMappings" ADD "PermissionGroupID" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" ADD "status" char`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD "Name" nchar(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" ADD "DatacenterName" nvarchar(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ADD "DatacenterName" nvarchar(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" ADD "ProvinceId" decimal`,
    );
    await queryRunner.query(
      `ALTER TABLE "sysdiagrams" ADD CONSTRAINT "UK_principal_name" UNIQUE ("name", "principal_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "CompanyLetterId_foreign_key" FOREIGN KEY ("companyLetterId") REFERENCES "Files"("Guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "AvatarId_foreign_key" FOREIGN KEY ("avatarId") REFERENCES "Files"("Guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."User" ADD CONSTRAINT "CompanyId_foreign_key" FOREIGN KEY ("companyId") REFERENCES "security"."Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Sessions" ADD CONSTRAINT "orgRef" FOREIGN KEY ("orgId") REFERENCES "vdc"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."RoleMapping" ADD CONSTRAINT "FK_RoleMapping_Role" FOREIGN KEY ("RoleId") REFERENCES "security"."Role"("Guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" ADD CONSTRAINT "FK_PermissionMappings_PermissionGroups" FOREIGN KEY ("PermissionGroupID") REFERENCES "security"."PermissionGroups"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionMappings" ADD CONSTRAINT "FK_PermissionMappings_Permissions" FOREIGN KEY ("PermissionID") REFERENCES "security"."Permissions"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."PermissionGroupsMappings" ADD CONSTRAINT "FK_PermissionGroupsMappings_PermissionGroups" FOREIGN KEY ("PermissionGroupID") REFERENCES "security"."PermissionGroups"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "vdc"."Organization" ADD CONSTRAINT "users" FOREIGN KEY ("userId") REFERENCES "security"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD CONSTRAINT "FK_InfoLog_User" FOREIGN KEY ("UserID") REFERENCES "security"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."InfoLog" ADD CONSTRAINT "FK_InfoLog_ServiceInstances" FOREIGN KEY ("ServiceInstanceID") REFERENCES "user"."ServiceInstances"("ID") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."ItemTypes" ADD CONSTRAINT "FK_ItemTypes_ServiceTypes" FOREIGN KEY ("ServiceTypeID", "DatacenterName") REFERENCES "services"."ServiceTypes"("ID","DatacenterName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."GroupsMapping" ADD CONSTRAINT "FK_GroupsMapping_Groups" FOREIGN KEY ("GroupID") REFERENCES "user"."Groups"("ID") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."GroupsMapping" ADD CONSTRAINT "FK_GroupsMapping_User" FOREIGN KEY ("UserID") REFERENCES "security"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Configs" ADD CONSTRAINT "FK_Configs_ServiceTypes" FOREIGN KEY ("ServiceTypeID", "DatacenterName") REFERENCES "services"."ServiceTypes"("ID","DatacenterName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."ErrorLog" ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES "security"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs"."DebugLog" ADD CONSTRAINT "FK_DebugLog_User" FOREIGN KEY ("UserID") REFERENCES "security"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "services"."Discounts" ADD CONSTRAINT "FK_Discounts_ServiceTypes" FOREIGN KEY ("ServiceTypeID", "DatacenterName") REFERENCES "services"."ServiceTypes"("ID","DatacenterName") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD CONSTRAINT "LogoId_foreign_key" FOREIGN KEY ("LogoId") REFERENCES "Files"("Guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD CONSTRAINT "Company_City_foreign_key" FOREIGN KEY ("CityId") REFERENCES "security"."City"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."Company" ADD CONSTRAINT "Company_Province_foreign_key" FOREIGN KEY ("ProvinceId") REFERENCES "security"."Province"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."ACL" ADD CONSTRAINT "FK_ACL_Role" FOREIGN KEY ("RoleId") REFERENCES "security"."Role"("Guid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "security"."City" ADD CONSTRAINT "Province_foreign_key" FOREIGN KEY ("ProvinceId") REFERENCES "security"."Province"("Id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
