import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserCity1729209506281 implements MigrationInterface {
    name = 'RemoveUserCity1729209506281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying(50)`);
    }

}
