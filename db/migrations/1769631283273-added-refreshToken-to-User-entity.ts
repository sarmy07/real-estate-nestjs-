import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRefreshTokenToUserEntity1769631283273 implements MigrationInterface {
    name = 'AddedRefreshTokenToUserEntity1769631283273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    }

}
