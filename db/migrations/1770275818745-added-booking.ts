import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBooking1770275818745 implements MigrationInterface {
    name = 'AddedBooking1770275818745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'approved', 'rejected', 'rescheduled', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'pending', "visitDateTime" TIMESTAMP NOT NULL, "note" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" integer, "userId" integer, "ownerId" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_aaacfb3ddf4c074dc358a9a94a0" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_8624b868142f2f4db0ba0fb9812" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_8624b868142f2f4db0ba0fb9812"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_aaacfb3ddf4c074dc358a9a94a0"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    }

}
