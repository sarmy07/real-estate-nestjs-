import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedImagesInPropertyEntity1769820217303 implements MigrationInterface {
    name = 'FixedImagesInPropertyEntity1769820217303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "isApproved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "property" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "images" jsonb`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_917755242ab5b0a0b08a63016d9" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_917755242ab5b0a0b08a63016d9"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "images" text array`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "isApproved"`);
    }

}
