import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { UseDataSourceMigration } from "../decorators/use-data-source-migration.decorator.js";
import { UserModel } from "../models/user.model.js";
import { getColumnDefinition } from "../utils/get-column-definition.util.js";
import { getTableName } from "../utils/get-table-name.util.js";

@UseDataSourceMigration()
export class CreateUserModel1674974135586 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const userTable = new Table();
		userTable.name = getTableName(UserModel);
		userTable.addColumn(getColumnDefinition(UserModel, "id"));
		userTable.addColumn(getColumnDefinition(UserModel, "email"));
		userTable.addColumn(getColumnDefinition(UserModel, "displayName"));
		await queryRunner.createTable(userTable, true);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(getTableName(UserModel), true);
	}
}
