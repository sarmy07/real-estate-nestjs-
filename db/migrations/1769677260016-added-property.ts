import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProperty1769677260016 implements MigrationInterface {
    name = 'AddedProperty1769677260016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."property_type_enum" AS ENUM('rent', 'sale')`);
        await queryRunner.query(`CREATE TYPE "public"."property_status_enum" AS ENUM('available', 'sold', 'rented')`);
        await queryRunner.query(`CREATE TABLE "property" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "type" "public"."property_type_enum" NOT NULL, "status" "public"."property_status_enum" NOT NULL DEFAULT 'available', "price" numeric(12,2) NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "images" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TYPE "public"."property_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."property_type_enum"`);
    }

}
