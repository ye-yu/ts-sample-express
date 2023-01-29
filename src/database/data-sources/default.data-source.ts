import { DataSourceOptions, DataSource } from "typeorm";
import { ConfigService } from "../../config/config.service.js";
import { UseDataSourceMigration } from "../decorators/use-data-source-migration.decorator.js";
import { UseDataSourceRepo } from "../decorators/use-data-source-repo.decorator.js";
import { createDatasourceLogger } from "../utils/create-datasource-logger.util.js";

await import("./init.js");

const datasourceOption: DataSourceOptions = {
	type: "mysql",
	url: ConfigService.database.databaseUrl,
	database: ConfigService.database.databaseDefaultDb,
	logger: createDatasourceLogger("default"),
	entities: UseDataSourceRepo.get("default"),
	migrations: UseDataSourceMigration.get("default"),
	migrationsTableName: "_typeorm_migrations",
};

if (
	ConfigService.database.databaseUsername &&
	ConfigService.database.databasePassword
) {
	Object.assign(datasourceOption, {
		username: ConfigService.database.databaseUsername,
		password: ConfigService.database.databasePassword,
	});
}

export const defaultDataSource = new DataSource(datasourceOption);
