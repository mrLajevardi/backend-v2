import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1705184271979 implements MigrationInterface {
    name = 'Test1705184271979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "FK_Invoices_ServiceInstances"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "FK_Invoices_Templates"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "FK_Invoices_User"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "RawAmount" float(53) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "PlanAmount" float(53) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "PlanRatio" float(53)`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "FinalAmount" float(53) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP COLUMN "Description"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD "Description" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "DF_c7c834cc427abf2ad6be7bb3d77"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "DF_c7c834cc427abf2ad6be7bb3d77" DEFAULT (0) FOR "Type"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "DF_423f5583ba7d90ab69c322c297f"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "DF_423f5583ba7d90ab69c322c297f" DEFAULT (0) FOR "IsPreInvoice"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "BaseAmount" float(53)`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "InvoiceTax" float(53)`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP COLUMN "FinalAmountWithTax"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD "FinalAmountWithTax" int`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "ServiceInstanceID" uniqueidentifier NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_Invoices" ON "user"."Invoices" ("ID") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "PK_Invoices" ON "user"."Invoices"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "ServiceInstanceID" uniqueidentifier`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP COLUMN "FinalAmountWithTax"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD "FinalAmountWithTax" float`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "InvoiceTax" float`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "BaseAmount" float`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "DF_423f5583ba7d90ab69c322c297f"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "DF_423f5583ba7d90ab69c322c297f" DEFAULT 0 FOR "IsPreInvoice"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP CONSTRAINT "DF_c7c834cc427abf2ad6be7bb3d77"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "DF_c7c834cc427abf2ad6be7bb3d77" DEFAULT 0 FOR "Type"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" DROP COLUMN "Description"`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD "Description" nvarchar(MAX) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "FinalAmount" float NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "PlanRatio" float`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "PlanAmount" float NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ALTER COLUMN "RawAmount" float NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "FK_Invoices_User" FOREIGN KEY ("UserID") REFERENCES "security"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "FK_Invoices_Templates" FOREIGN KEY ("TemplateID") REFERENCES "services"."Templates"("Guid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user"."Invoices" ADD CONSTRAINT "FK_Invoices_ServiceInstances" FOREIGN KEY ("ServiceInstanceID") REFERENCES "user"."ServiceInstances"("ID") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
