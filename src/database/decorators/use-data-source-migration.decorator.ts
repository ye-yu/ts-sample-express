import { DatasourceRegistryHandler } from "../types/datasource-registry-handler.type.js";

export const migrationDatasourceRegistries: Record<string, Function[]> = {};

export const UseDataSourceMigration: DatasourceRegistryHandler = (
	source = "default"
) => {
	return (target) => {
		migrationDatasourceRegistries[source] =
			migrationDatasourceRegistries[source] ?? [];
		migrationDatasourceRegistries[source].push(target);
	};
};

UseDataSourceMigration.get = (source = "default"): Function[] => {
	return migrationDatasourceRegistries[source] ?? [];
};
