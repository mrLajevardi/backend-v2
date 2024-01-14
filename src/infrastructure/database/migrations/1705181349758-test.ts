import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1705181349758 implements MigrationInterface {
    name = 'Test1705181349758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "PK_ServiceInstances"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP COLUMN "ID"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD "ID" uniqueidentifier NOT NULL CONSTRAINT "DF_5d355b9a1109e7d645d3f048802" DEFAULT newsequentialid()`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "PK_5d355b9a1109e7d645d3f048802" PRIMARY KEY ("ID")`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_a4a401449b82adfaa58edcfa224"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_a4a401449b82adfaa58edcfa224" DEFAULT (0) FOR "IsDeleted"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_32bb0a455aa42f99aec29362c59"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_32bb0a455aa42f99aec29362c59" DEFAULT (0) FOR "WarningSent"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_361dd00942b1d604ba34e156c19"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_361dd00942b1d604ba34e156c19" DEFAULT (0) FOR "IsDisabled"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ALTER COLUMN "PlanRatio" float(53)`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_681c020e2a606eaaede284b3da7"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_681c020e2a606eaaede284b3da7" DEFAULT (0) FOR "RetryCount"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP COLUMN "DaysLeft"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD "DaysLeft" int`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_5463cf7a7cc049785a08a7b6485"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_5463cf7a7cc049785a08a7b6485" DEFAULT (0) FOR "Credit"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_4d61f639f95d7ad8617dd974c36"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_4d61f639f95d7ad8617dd974c36" DEFAULT (0) FOR "AutoPaid"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_ServiceInstances" ON "user"."ServiceInstances" ("ID") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "PK_ServiceInstances" ON "user"."ServiceInstances"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_4d61f639f95d7ad8617dd974c36"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_4d61f639f95d7ad8617dd974c36" DEFAULT 0 FOR "AutoPaid"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_5463cf7a7cc049785a08a7b6485"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_5463cf7a7cc049785a08a7b6485" DEFAULT 0 FOR "Credit"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP COLUMN "DaysLeft"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD "DaysLeft" int`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_681c020e2a606eaaede284b3da7"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_681c020e2a606eaaede284b3da7" DEFAULT 0 FOR "RetryCount"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ALTER COLUMN "PlanRatio" float`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_361dd00942b1d604ba34e156c19"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_361dd00942b1d604ba34e156c19" DEFAULT 0 FOR "IsDisabled"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_32bb0a455aa42f99aec29362c59"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_32bb0a455aa42f99aec29362c59" DEFAULT 0 FOR "WarningSent"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_a4a401449b82adfaa58edcfa224"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "DF_a4a401449b82adfaa58edcfa224" DEFAULT 0 FOR "IsDeleted"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "DF_5d355b9a1109e7d645d3f048802"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP CONSTRAINT "PK_5d355b9a1109e7d645d3f048802"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" DROP COLUMN "ID"`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD "ID" uniqueidentifier NOT NULL CONSTRAINT "DF_5d355b9a1109e7d645d3f048802" DEFAULT NEWSEQUENTIALID()`);
        await queryRunner.query(`ALTER TABLE "user"."ServiceInstances" ADD CONSTRAINT "PK_ServiceInstances" PRIMARY KEY ("ID")`);
    }

}
