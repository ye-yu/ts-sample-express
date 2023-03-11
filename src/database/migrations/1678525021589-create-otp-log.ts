import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { UseDataSourceMigration } from "../decorators/use-data-source-migration.decorator.js";
import { OtpLogModel } from "../models/otp-log.model.js";
import { getColumnDefinition } from "../utils/get-column-definition.util.js";
import { getForeignKeyDefinition } from "../utils/get-foreign-key-definition.util.js";
import { getTableName } from "../utils/get-table-name.util.js";

@UseDataSourceMigration()
export class CreateOtpLog1678525021589 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const otpLogTable = new Table();
		otpLogTable.name = getTableName(OtpLogModel);
		otpLogTable.addColumn(getColumnDefinition(OtpLogModel, "id"));
		otpLogTable.addColumn(getColumnDefinition(OtpLogModel, "userId"));
		otpLogTable.addColumn(getColumnDefinition(OtpLogModel, "password"));
		otpLogTable.addColumn(getColumnDefinition(OtpLogModel, "loggedInAt"));
		otpLogTable.addColumn(getColumnDefinition(OtpLogModel, "createdAt"));
		otpLogTable.addColumn(getColumnDefinition(OtpLogModel, "updatedAt"));
		await queryRunner.createTable(otpLogTable);
		await queryRunner.createForeignKey(
			getTableName(OtpLogModel),
			getForeignKeyDefinition(OtpLogModel, "user")
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const tableForeignKey = getForeignKeyDefinition(OtpLogModel, "user");
		await queryRunner.dropForeignKey(
			getTableName(OtpLogModel),
			tableForeignKey
		);
		await queryRunner.dropTable(getTableName(OtpLogModel));
	}
}
