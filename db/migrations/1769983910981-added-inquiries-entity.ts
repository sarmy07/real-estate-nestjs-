import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedInquiriesEntity1769983910981 implements MigrationInterface {
    name = 'AddedInquiriesEntity1769983910981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."inquiry_status_enum" AS ENUM('pending', 'responded')`);
        await queryRunner.query(`CREATE TABLE "inquiry" ("id" SERIAL NOT NULL, "message" text NOT NULL, "status" "public"."inquiry_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" integer, "senderId" integer, "receiverId" integer, CONSTRAINT "PK_3e226d0994e8bd24252dd65e1b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_56594aa554da048bd355b8f37d6" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_7fb0576998e05543c443ffaee41" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiry" ADD CONSTRAINT "FK_762a595079d375bc6c27e123b88" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_762a595079d375bc6c27e123b88"`);
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_7fb0576998e05543c443ffaee41"`);
        await queryRunner.query(`ALTER TABLE "inquiry" DROP CONSTRAINT "FK_56594aa554da048bd355b8f37d6"`);
        await queryRunner.query(`DROP TABLE "inquiry"`);
        await queryRunner.query(`DROP TYPE "public"."inquiry_status_enum"`);
    }

}
