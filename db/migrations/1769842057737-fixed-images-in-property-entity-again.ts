import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedImagesInPropertyEntityAgain1769842057737 implements MigrationInterface {
    name = 'FixedImagesInPropertyEntityAgain1769842057737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "imagesPublicId" text array`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "images" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "property" ADD "images" jsonb`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "imagesPublicId"`);
    }

}
